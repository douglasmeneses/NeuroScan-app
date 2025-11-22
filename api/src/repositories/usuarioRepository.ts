import { PrismaClient } from "@prisma/client";
import { CreateUsuarioInput, UpdateUsuarioSociodemograficoInput } from "../types/schema";

export class UsuarioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      orderBy: { id: "asc" },
    });
  }

  async findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id },
      include: {
        respostas: {
          include: {
            pergunta: {
              include: {
                questionario: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateUsuarioInput) {
    return this.prisma.usuario.create({ data });
  }

  async update(id: number, data: Partial<CreateUsuarioInput>) {
    return this.prisma.usuario.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

}
