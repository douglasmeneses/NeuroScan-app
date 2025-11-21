/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";

export const prismaMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.prisma = prisma;
  next();
};
