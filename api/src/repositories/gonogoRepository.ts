import { PrismaClient } from "@prisma/client";

export class GoNogoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.goNogo.findMany({
      include: {
        usuario: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async findByUsuarioId(usuario_id: number) {
    return this.prisma.goNogo.findMany({
      where: { usuario_id },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async create(data: {
    usuario_id: number;
    erros_comissao_percentual: number;
    erros_omissao_percentual: number;
    acerto_go_percentual: number;
    tempo_medio_reacao_ms: number;
    variabilidade_rt_ms: number;
    latencia_media_nogo_erro: number;
  }) {
    return this.prisma.goNogo.create({
      data,
      include: {
        usuario: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.goNogo.findUnique({
      where: { id },
      include: {
        usuario: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      erros_comissao_percentual?: number;
      erros_omissao_percentual?: number;
      acerto_go_percentual?: number;
      tempo_medio_reacao_ms?: number;
      variabilidade_rt_ms?: number;
      latencia_media_nogo_erro?: number;
    }
  ) {
    return this.prisma.goNogo.update({
      where: { id },
      data,
      include: {
        usuario: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.goNogo.delete({
      where: { id },
    });
  }
}
