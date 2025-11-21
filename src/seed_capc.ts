import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const questionsText = [
    "Eu consigo soluções para problemas através dos meus sonhos.",
    "Olhar para um problema de um ângulo diferente pode levar a uma solução.",
    "Quando me dedico a um problema, procuro por pistas ao meu redor.",
    "Eu tento simular soluções potenciais para explorar a eficácia delas.",
    "Quando fico preso em um problema, uma solução só vem a mim quando me afasto dele.",
    "Quando sou desafiado por um problema, tento aplicar soluções prévias para a nova situação.",
    "Imaginar possíveis soluções para um problema leva a novas ideias.",
    "Quando me dedico a um problema, peço que outras pessoas ajudem a gerar soluções em potencial.",
    "Me envolver fisicamente no meu trabalho me leva a boas soluções.",
    "Enquanto trabalho em um problema, tento imaginar todos os aspectos da solução.",
    "Enquanto trabalho em algo, eu quase sempre presto atenção aos meus sentidos.",
    "Quando me dedico a um problema, tento ter uma perspectiva diferente da situação.",
    "Combinar várias ideias pode levar a soluções eficazes.",
    "Quando me dedico a um problema, faço conexões entre meu problema atual e uma situação relacionada.",
    "Nos estágios iniciais de resolução de um problema, tento adiar a avaliação das minhas ideias.",
    "Quando sou desafiado por um problema, procuro detalhes que normalmente não notaria.",
    "Eu tenho boas ideias enquanto faço algo rotineiro, como dirigir ou tomar banho.",
    "Eu encontro soluções para problemas quando minha mente está relaxada.",
    "Pensar em mais de uma ideia ao mesmo tempo pode levar a um novo entendimento.",
    "Enquanto trabalho em algo, tento produzir o máximo de ideias possíveis.",
    "Quando trabalho intensamente, não gosto de parar.",
    "Posso perder completamente a noção do tempo se trabalho intensivamente."
];

async function main() {
  // Cria usuário
  const usuario = await prisma.usuario.create({
    data: {
      iniciais_do_nome: 'CAP',
      idade: 30,
    },
  });

  // Cria questionário CAPC
  const questionario = await prisma.questionario.create({
    data: {
      nome: 'CAPC',
      quantidade_questoes: questionsText.length,
      perguntas: {
        create: questionsText.map((texto, idx) => ({
          numero: idx + 1,
          texto,
        })),
      },
    },
    include: {
      perguntas: true,
    },
  });

  console.log('Usuário criado:', usuario);
  console.log('Questionário CAPC criado:', questionario);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
