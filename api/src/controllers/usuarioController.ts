/// <reference path="../types/express.d.ts" />
import { Request, Response } from "express";
import { UsuariosService } from "../services/usuariosService";
import { asyncHandler } from "../middleware/async.middleware";

export const listarUsuarios = asyncHandler(async (req: Request, res: Response) => {
  const service = new UsuariosService(req.prisma);
  const usuarios = await service.findAll();
  res.json(usuarios);
});

export const buscarUsuarioPorId = asyncHandler(async (req: Request, res: Response) => {
  const service = new UsuariosService(req.prisma);
  const id = Number.parseInt(req.params.id);
  const usuario = await service.findById(id);
  res.json(usuario);
});

export const criarUsuario = asyncHandler(async (req: Request, res: Response) => {
  const service = new UsuariosService(req.prisma);
  const usuario = await service.create(req.body);
  res.status(201).json({ id: usuario.id });
});

export const atualizarUsuario = asyncHandler(async (req: Request, res: Response) => {
  const service = new UsuariosService(req.prisma);
  const id = Number.parseInt(req.params.id);
  const usuario = await service.update(id, req.body);
  res.json(usuario);
});

export const deletarUsuario = asyncHandler(async (req: Request, res: Response) => {
  const service = new UsuariosService(req.prisma);
  const id = Number.parseInt(req.params.id);
  await service.delete(id);
  res.status(204).send();
});


