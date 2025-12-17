/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import { GoNogoService } from "../services/gonogoService";
import { asyncHandler } from "../middleware/async.middleware";

export const listarGonogos = asyncHandler(
  async (req: Request, res: Response) => {
    const service = new GoNogoService(req.prisma);
    const gonogos = await service.findAll();
    res.json(gonogos);
  }
);

export const buscarGonogosPorUsuario = asyncHandler(
  async (req: Request, res: Response) => {
    const usuario_id = Number.parseInt(req.params.usuario_id);
    const service = new GoNogoService(req.prisma);
    const gonogos = await service.findByUsuarioId(usuario_id);
    res.json(gonogos);
  }
);

export const buscarGonogoPorId = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const service = new GoNogoService(req.prisma);
    const gonogo = await service.findById(id);
    res.json(gonogo);
  }
);

export const criarGonogo = asyncHandler(async (req: Request, res: Response) => {
  const service = new GoNogoService(req.prisma);
  const gonogo = await service.create(req.body);
  res.status(201).json(gonogo);
});

export const atualizarGonogo = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const service = new GoNogoService(req.prisma);
    const gonogo = await service.update(id, req.body);
    res.json(gonogo);
  }
);

export const deletarGonogo = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id);
    const service = new GoNogoService(req.prisma);
    await service.delete(id);
    res.status(204).send();
  }
);
