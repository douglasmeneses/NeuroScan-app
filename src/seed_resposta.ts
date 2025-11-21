import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Busca usuário e pergunta
  const usuario = await prisma.usuario.findFirst();
  const pergunta = await prisma.pergunta.findFirst();

  if (!usuario || !pergunta) {
    throw new Error('Usuário ou pergunta não encontrados');
  }

  // Cria resposta
  const resposta = await prisma.resposta.create({
    data: {
      usuario_id: usuario.id,
      pergunta_id: pergunta.id,
      resposta: '2',
      duracao: 8.2,
      idle: 3.04,
      quantidade_cliques: 7,
      quantidade_passos: 0,
      dh_inicio: new Date(),
      dh_fim: new Date(Date.now() + 8200),
    },
  });

  console.log('Resposta criada:', resposta);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
