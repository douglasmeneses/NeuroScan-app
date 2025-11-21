/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import { RespostasService } from "../services/respostasService";
import { asyncHandler } from "../middleware/async.middleware";
import { CompactSensorDataSchema } from "../types/sensor-data.types";
import { parseCompactSensorData } from "../utils/sensor-parser";

export const listarRespostas = asyncHandler(async (req: Request, res: Response) => {
  const service = new RespostasService(req.prisma);
  const respostas = await service.findAll();
  res.json(respostas);
});

export const criarRespostaDeJsonCompactoComGzip = asyncHandler(async (req: Request, res: Response) => {
  const startTime = Date.now();

  // Valida o formato compacto
  const validated = CompactSensorDataSchema.parse(req.body);

  // Converte para formato expandido
  const expandedData = parseCompactSensorData(validated);

  // Cria a resposta no banco
  const service = new RespostasService(req.prisma);
  const result = await service.create(expandedData);

  const endTime = Date.now();

  res.status(201).json({
    ...result,
    formato: "compacto-gzip",
    sensores_processados: validated.sensores.length,
    tempo_processamento_ms: endTime - startTime,
    reducao_tamanho: "~86%",
    compressao_http: "gzip (level 6)",
  });
});

export const buscarRespostaPorId = asyncHandler(async (req: Request, res: Response) => {
  const service = new RespostasService(req.prisma);
  const id = Number.parseInt(req.params.id);
  const resposta = await service.findById(id);
  res.json(resposta);
});

export const buscarSensoresPorResposta = asyncHandler(async (req: Request, res: Response) => {
  const service = new RespostasService(req.prisma);
  const id = Number.parseInt(req.params.id);
  const sensores = await service.findSensoresByRespostaId(id);
  res.json(sensores);
});

