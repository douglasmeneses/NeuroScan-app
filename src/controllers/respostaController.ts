import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as respostasService from "../services/respostasService";

export const listarRespostas = async (req: Request, res: Response) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const respostas = await respostasService.listarRespostas(prisma);
    res.json(respostas);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar respostas" });
  }
};

export const criarResposta = async (req: Request, res: Response) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const result = await respostasService.criarResposta(prisma, req.body);
    res.status(201).json(result);
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: error.message || "Erro ao criar resposta" });
  }
};

export const buscarRespostaPorId = async (req: Request, res: Response) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const { id } = req.params;
    const resposta = await respostasService.buscarRespostaPorId(prisma, id);
    if (!resposta) {
      return res.status(404).json({ error: "Resposta não encontrada" });
    }
    res.json(resposta);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar resposta" });
  }
};

export const buscarSensoresPorResposta = async (
  req: Request,
  res: Response
) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const { id } = req.params;
    const sensores = await respostasService.buscarSensoresPorResposta(
      prisma,
      id
    );
    res.json(sensores);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dados dos sensores" });
  }
};
