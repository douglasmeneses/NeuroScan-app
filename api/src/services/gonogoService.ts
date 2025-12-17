import { PrismaClient } from "@prisma/client";
import { GoNogoRepository } from "../repositories/gonogoRepository";
import { AppError } from "../middleware/error.middleware";
import { z } from "zod";

const createGoNogoSchema = z.object({
  usuario_id: z.number().int().positive(),
  erros_comissao_percentual: z.number(),
  erros_omissao_percentual: z.number(),
  acerto_go_percentual: z.number(),
  tempo_medio_reacao_ms: z.number(),
  variabilidade_rt_ms: z.number(),
  latencia_media_nogo_erro: z.number(),
});

const updateGoNogoSchema = z.object({
  erros_comissao_percentual: z.number().optional(),
  erros_omissao_percentual: z.number().optional(),
  acerto_go_percentual: z.number().optional(),
  tempo_medio_reacao_ms: z.number().optional(),
  variabilidade_rt_ms: z.number().optional(),
  latencia_media_nogo_erro: z.number().optional(),
});

export class GoNogoService {
  private readonly gonogoRepo: GoNogoRepository;

  constructor(prisma: PrismaClient) {
    this.gonogoRepo = new GoNogoRepository(prisma);
  }

  async findAll() {
    return this.gonogoRepo.findAll();
  }

  async findByUsuarioId(usuario_id: number) {
    return this.gonogoRepo.findByUsuarioId(usuario_id);
  }

  async findById(id: number) {
    const gonogo = await this.gonogoRepo.findById(id);
    if (!gonogo) {
      throw new AppError("Registro GoNogo não encontrado", 404);
    }
    return gonogo;
  }

  async create(data: unknown) {
    const validatedData = createGoNogoSchema.parse(data);
    return this.gonogoRepo.create(validatedData);
  }

  async update(id: number, data: unknown) {
    const validatedData = updateGoNogoSchema.parse(data);

    const existingGonogo = await this.gonogoRepo.findById(id);
    if (!existingGonogo) {
      throw new AppError("Registro GoNogo não encontrado", 404);
    }

    return this.gonogoRepo.update(id, validatedData);
  }

  async delete(id: number) {
    const existingGonogo = await this.gonogoRepo.findById(id);
    if (!existingGonogo) {
      throw new AppError("Registro GoNogo não encontrado", 404);
    }

    return this.gonogoRepo.delete(id);
  }
}
