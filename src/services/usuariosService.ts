import { PrismaClient } from "@prisma/client";
import { createUsuarioSchema } from "../types/schema";
import { UsuarioRepository } from "../repositories/usuarioRepository";
import { AppError } from "../middleware/error.middleware";

export class UsuariosService {
  private readonly usuarioRepo: UsuarioRepository;

  constructor(prisma: PrismaClient) {
    this.usuarioRepo = new UsuarioRepository(prisma);
  }

  async findAll() {
    return this.usuarioRepo.findAll();
  }

  async findById(id: number) {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return usuario;
  }

  async create(data: unknown) {
    const validatedData = createUsuarioSchema.parse(data);
    return this.usuarioRepo.create(validatedData);
  }

  async update(id: number, data: unknown) {
    await this.findById(id); // Verifica se existe
    const validatedData = createUsuarioSchema.partial().parse(data);
    return this.usuarioRepo.update(id, validatedData);
  }

  async delete(id: number) {
    await this.findById(id); // Verifica se existe
    return this.usuarioRepo.delete(id);
  }
}
