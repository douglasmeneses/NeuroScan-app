import { PrismaClient } from "@prisma/client";
import { createRespostaSchema } from "../types/schema";
import {
  RespostaRepository,
  ColetaRepository,
  AcelerometroRepository,
  GiroscopioRepository,
} from "../repositories/respostaRepository";
import { AppError } from "../middleware/error.middleware";

export class RespostasService {
  private readonly respostaRepo: RespostaRepository;
  private readonly coletaRepo: ColetaRepository;
  private readonly acelerometroRepo: AcelerometroRepository;
  private readonly giroscopioRepo: GiroscopioRepository;

  constructor(prisma: PrismaClient) {
    this.respostaRepo = new RespostaRepository(prisma);
    this.coletaRepo = new ColetaRepository(prisma);
    this.acelerometroRepo = new AcelerometroRepository(prisma);
    this.giroscopioRepo = new GiroscopioRepository(prisma);
  }

  async findAll() {
    return this.respostaRepo.findAll();
  }

  async findById(id: number) {
    const resposta = await this.respostaRepo.findById(id);
    if (!resposta) {
      throw new AppError("Resposta não encontrada", 404);
    }
    return resposta;
  }

  async create(data: unknown) {
    const validatedData = createRespostaSchema.parse(data);

    const {
      usuario_id,
      pergunta_id,
      resposta,
      duracao,
      idle,
      quantidade_cliques,
      quantidade_passos,
      dh_inicio,
      dh_fim,
      dados_sensores,
    } = validatedData;

    const respostaData = {
      usuario_id,
      pergunta_id,
      resposta,
      duracao,
      idle,
      quantidade_cliques,
      quantidade_passos,
      dh_inicio,
      dh_fim,
    };

    const respostaCriada = await this.respostaRepo.create(respostaData);

    let sensoresProcessados = 0;

    // Processar sensores usando SQL RAW puro para máxima performance
    if (dados_sensores && dados_sensores.length > 0) {
      const prisma = this.respostaRepo["prisma"];
      
      await prisma.$transaction(
        async (tx) => {
          // OTIMIZAÇÃO 1: Inserir todas as coletas, acelerômetros e giroscópios em uma única query composta
          // Isso reduz drasticamente o número de round-trips ao banco
          
          // Preparar valores para inserção em lote
          const coletaValues: string[] = [];
          const coletaParams: any[] = [];
          let paramIndex = 1;

          for (const sensor of dados_sensores) {
            coletaValues.push(`($${paramIndex}, $${paramIndex + 1})`);
            coletaParams.push(respostaCriada.id, sensor.timestamp);
            paramIndex += 2;
          }

          // Inserir todas as coletas de uma vez e obter IDs
          const coletasResult = await tx.$queryRawUnsafe<{ id: number }[]>(
            `INSERT INTO coletas (resposta_id, timestamp) 
             VALUES ${coletaValues.join(", ")} 
             RETURNING id`,
            ...coletaParams
          );

          const coletasIds = coletasResult.map((row) => row.id);

          // OTIMIZAÇÃO 2: Inserir acelerômetros e giroscópios em paralelo usando SQL RAW
          const insertPromises: Promise<any>[] = [];

          // Preparar valores para acelerômetros
          const accelValues: string[] = [];
          const accelParams: any[] = [];
          paramIndex = 1;

          for (let i = 0; i < dados_sensores.length; i++) {
            const sensor = dados_sensores[i];
            if (sensor.acelerometro) {
              accelValues.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
              accelParams.push(
                coletasIds[i],
                sensor.acelerometro.eixo_x,
                sensor.acelerometro.eixo_y,
                sensor.acelerometro.eixo_z
              );
              paramIndex += 4;
            }
          }

          if (accelValues.length > 0) {
            insertPromises.push(
              tx.$queryRawUnsafe(
                `INSERT INTO acelerometros (coleta_id, eixo_x, eixo_y, eixo_z) 
                 VALUES ${accelValues.join(", ")}`,
                ...accelParams
              )
            );
          }

          // Preparar valores para giroscópios
          const gyroValues: string[] = [];
          const gyroParams: any[] = [];
          paramIndex = 1;

          for (let i = 0; i < dados_sensores.length; i++) {
            const sensor = dados_sensores[i];
            if (sensor.giroscopio) {
              gyroValues.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
              gyroParams.push(
                coletasIds[i],
                sensor.giroscopio.eixo_x,
                sensor.giroscopio.eixo_y,
                sensor.giroscopio.eixo_z
              );
              paramIndex += 4;
            }
          }

          if (gyroValues.length > 0) {
            insertPromises.push(
              tx.$queryRawUnsafe(
                `INSERT INTO giroscopios (coleta_id, eixo_x, eixo_y, eixo_z) 
                 VALUES ${gyroValues.join(", ")}`,
                ...gyroParams
              )
            );
          }

          // OTIMIZAÇÃO 3: Executar inserções em paralelo
          await Promise.all(insertPromises);

          sensoresProcessados = dados_sensores.length;
        },
        {
          maxWait: 5000,  // Reduzido para 5 segundos
          timeout: 15000, // Reduzido para 15 segundos
        }
      );
    }

    return {
      id: respostaCriada.id,
      message: "Resposta criada com sucesso",
      sensores_processados: sensoresProcessados,
    };
  }

  async findSensoresByRespostaId(id: number) {
    return this.coletaRepo.findByRespostaId(id);
  }
}
