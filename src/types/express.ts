import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export interface RequestWithPrisma extends Request {
  prisma: PrismaClient;
}

export type RouteHandler = (req: RequestWithPrisma, res: Response) => Promise<void>;

