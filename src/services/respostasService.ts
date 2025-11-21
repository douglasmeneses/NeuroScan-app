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

    // Processar sensores usando SQL RAW para máxima performance
    if (dados_sensores && dados_sensores.length > 0) {
      const prisma = this.respostaRepo["prisma"];
      
      await prisma.$transaction(
        async (tx) => {
          // Inserir todas as coletas em uma única query usando SQL RAW
          const timestampValues = dados_sensores
            .map((sensor, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`)
            .join(", ");

          const timestampParams = dados_sensores.flatMap((sensor) => [
            respostaCriada.id,
            sensor.timestamp,
          ]);

          const coletasResult = await tx.$queryRawUnsafe<{ id: number }[]>(
            `INSERT INTO coletas (resposta_id, timestamp) 
             VALUES ${timestampValues} 
             RETURNING id`,
            ...timestampParams
          );

          const coletasIds = coletasResult.map((row) => row.id);

          // Preparar dados de acelerômetros e giroscópios com IDs
          const acelerometrosData = [];
          const giroscopiosData = [];

          for (let i = 0; i < dados_sensores.length; i++) {
            const sensor = dados_sensores[i];
            const coletaId = coletasIds[i];

            if (sensor.acelerometro) {
              acelerometrosData.push({
                coleta_id: coletaId,
                eixo_x: sensor.acelerometro.eixo_x,
                eixo_y: sensor.acelerometro.eixo_y,
                eixo_z: sensor.acelerometro.eixo_z,
              });
            }

            if (sensor.giroscopio) {
              giroscopiosData.push({
                coleta_id: coletaId,
                eixo_x: sensor.giroscopio.eixo_x,
                eixo_y: sensor.giroscopio.eixo_y,
                eixo_z: sensor.giroscopio.eixo_z,
              });
            }
          }

          // Inserir acelerômetros e giroscópios em batch
          if (acelerometrosData.length > 0) {
            await tx.acelerometro.createMany({ 
              data: acelerometrosData,
              skipDuplicates: true,
            });
          }

          if (giroscopiosData.length > 0) {
            await tx.giroscopio.createMany({ 
              data: giroscopiosData,
              skipDuplicates: true,
            });
          }

          sensoresProcessados = dados_sensores.length;
        },
        {
          maxWait: 10000, // 10 segundos
          timeout: 30000, // 30 segundos
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
