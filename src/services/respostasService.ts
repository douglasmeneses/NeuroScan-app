import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  RespostaRepository,
  ColetaRepository,
  AcelerometroRepository,
  GiroscopioRepository,
} from "../repositories/respostaRepository";

const createRespostaSchema = z.object({
  usuario_id: z.coerce.number().int().positive(),
  pergunta_id: z.coerce.number().int().positive(),
  resposta: z.union([z.string(), z.number()]).transform((val) => String(val)),
  duracao: z.coerce.number().min(0),
  idle: z.coerce.number().min(0),
  quantidade_cliques: z.coerce.number().int().min(0),
  quantidade_passos: z.coerce.number().int().min(0),
  dh_inicio: z.string().datetime().or(z.date()),
  dh_fim: z.string().datetime().or(z.date()),
  dados_sensores: z
    .array(
      z.object({
        timestamp: z.string().datetime().or(z.date()),
        acelerometro: z
          .object({
            eixo_x: z.number(),
            eixo_y: z.number(),
            eixo_z: z.number(),
          })
          .optional(),
        giroscopio: z
          .object({
            eixo_x: z.number(),
            eixo_y: z.number(),
            eixo_z: z.number(),
          })
          .optional(),
      })
    )
    .optional(),
});

function parseDate(dateInput: string | Date): Date {
  if (dateInput instanceof Date) {
    return dateInput;
  }
  let isoString = dateInput;
  if (!isoString.endsWith("Z")) {
    isoString += ".000Z";
  }
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Data inválida: ${dateInput}`);
  }
  return date;
}

export async function listarRespostas(prisma: PrismaClient) {
  const respostaRepo = new RespostaRepository(prisma);
  return respostaRepo.findAll();
}

export async function criarResposta(prisma: PrismaClient, body: any) {
  const validatedData = createRespostaSchema.parse(body);
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
    dados_sensores = [],
  } = validatedData;

  const respostaRepo = new RespostaRepository(prisma);
  const coletaRepo = new ColetaRepository(prisma);
  const acelerometroRepo = new AcelerometroRepository(prisma);
  const giroscopioRepo = new GiroscopioRepository(prisma);

  const respostaData = {
    usuario_id,
    pergunta_id,
    resposta,
    duracao,
    idle,
    quantidade_cliques,
    quantidade_passos,
    dh_inicio: parseDate(dh_inicio),
    dh_fim: parseDate(dh_fim),
  };

  const respostaCriada = await respostaRepo.create(respostaData);

  if (dados_sensores && dados_sensores.length > 0) {
    for (const sensor of dados_sensores) {
      try {
        const timestampData = parseDate(sensor.timestamp);
        const coleta = await coletaRepo.create({
          resposta_id: respostaCriada.id,
          timestamp: timestampData,
        });
        if (sensor.acelerometro) {
          await acelerometroRepo.create({
            coleta_id: coleta.id,
            eixo_x: sensor.acelerometro.eixo_x,
            eixo_y: sensor.acelerometro.eixo_y,
            eixo_z: sensor.acelerometro.eixo_z,
          });
        }
        if (sensor.giroscopio) {
          await giroscopioRepo.create({
            coleta_id: coleta.id,
            eixo_x: sensor.giroscopio.eixo_x,
            eixo_y: sensor.giroscopio.eixo_y,
            eixo_z: sensor.giroscopio.eixo_z,
          });
        }
      } catch {
        // Log e continue
      }
    }
  }

  return {
    id: respostaCriada.id,
    message: "Resposta criada com sucesso",
    sensores_processados: dados_sensores?.length || 0,
  };
}

export async function buscarRespostaPorId(prisma: PrismaClient, id: string) {
  const respostaRepo = new RespostaRepository(prisma);
  return respostaRepo.findById(parseInt(id));
}

export async function buscarSensoresPorResposta(
  prisma: PrismaClient,
  id: string
) {
  const coletaRepo = new ColetaRepository(prisma);
  return coletaRepo.findByRespostaId(parseInt(id));
}
