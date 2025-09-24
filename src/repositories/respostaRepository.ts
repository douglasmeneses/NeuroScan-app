import { PrismaClient } from "@prisma/client";

export class RespostaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.resposta.findMany({
      include: {
        usuario: true,
        pergunta: {
          include: {
            questionario: true,
          },
        },
      },
      orderBy: {
        dh_inicio: "desc",
      },
    });
  }

  async create(data: any) {
    return this.prisma.resposta.create({ data });
  }

  async findById(id: number) {
    return this.prisma.resposta.findUnique({
      where: { id },
      include: {
        usuario: true,
        pergunta: {
          include: {
            questionario: true,
          },
        },
        coletas: {
          include: {
            acelerometro: true,
            giroscopio: true,
          },
          orderBy: {
            timestamp: "asc",
          },
        },
      },
    });
  }
}

export class ColetaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.coleta.create({ data });
  }

  async findByRespostaId(resposta_id: number) {
    return this.prisma.coleta.findMany({
      where: { resposta_id },
      include: {
        acelerometro: true,
        giroscopio: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
  }
}

export class AcelerometroRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(data: any) {
    return this.prisma.acelerometro.create({ data });
  }
}

export class GiroscopioRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(data: any) {
    return this.prisma.giroscopio.create({ data });
  }
}
