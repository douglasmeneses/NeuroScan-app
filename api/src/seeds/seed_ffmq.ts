import { PrismaClient } from "@prisma/client";

const ffmqQuestionsText = [
    "Quando estou caminhando, eu deliberadamente percebo as sensações do meu corpo em movimento.",
    "Sou bom para encontrar palavras que descrevam os meus sentimentos.",
    "Eu me critico por ter emoções irracionais ou inapropriadas.",
    "Eu percebo meus sentimentos e emoções sem ter que reagir a eles.",
    "Quando faço algo, minha mente voa e me distraio facilmente.",
    "Quando eu tomo banho, eu fico alerta às sensações da água no meu corpo.",
    "Eu consigo facilmente descrever minhas crenças, opiniões e expectativas em palavras.",
    "Eu não presto atenção no que faço porque fico sonhando acordado, preocupado com outras coisas ou distraído.",
    "Eu observo meus sentimentos sem me perder neles.",
    "Eu digo a mim mesmo que eu não deveria me sentir da forma como estou me sentindo.",
    "Eu percebo como a comida e a bebida afetam meus pensamentos, sensações corporais e emoções.",
    "É difícil para mim encontrar palavras para descrever o que estou pensando.",
    "Eu me distraio facilmente.",
    "Eu acredito que alguns dos meus pensamentos são maus ou anormais e eu não deveria pensar daquela forma.",
    "Eu presto atenção em sensações, tais como o vento em meus cabelos ou o sol no meu rosto.",
    "Eu tenho problemas para encontrar as palavras certas para expressar como me sinto sobre as coisas.",
    "Eu faço julgamentos sobre se meus pensamentos são bons ou maus.",
    "Eu acho difícil permanecer focado no que está acontecendo no momento presente.",
    "Geralmente, quando tenho imagens ou pensamentos ruins, sou capaz de apenas notá-los sem ser levado por eles.",
    "Eu presto atenção aos sons, tais como o tic tac do relógio, o canto dos pássaros ou dos carros passando.",
    "Em situações difíceis, eu consigo fazer uma pausa, sem reagir imediatamente.",
    "Quando tenho uma sensação no meu corpo, é difícil para mim descrevê-la porque não consigo encontrar as palavras certas.",
    "Eu faço coisas sem estar plenamente consciente do que estou fazendo..",
    "Geralmente, quando tenho imagens ou pensamentos ruins, eu me sinto calmo logo depois.",
    "Eu digo a mim mesmo que eu não deveria pensar da forma como estou pensando.",
    "Eu percebo o cheiro e o aroma das coisas.",
    "Mesmo quando me sinto terrivelmente aborrecido, consigo encontrar uma maneira de me expressar em palavras.",
    "Eu realizo atividades apressadamente sem estar realmente atento a elas.",
    "Geralmente, quando tenho pensamentos aflitivos, sou capaz de apenas notá-los, sem reagir a eles.",
    "Eu acho que algumas das minhas emoções são más ou inapropriadas e eu não deveria senti-las.",
    "Eu percebo elementos visuais na arte ou na natureza tais como: cores, formatos, texturas ou padrões de luz e sombra.",
    "Minha tendência natural é colocar minhas experiências em palavras.",
    "Geralmente, quando eu tenho imagens ou pensamentos ruins, eu apenas os percebo e os deixo ir.",
    "Eu realizo tarefas automaticamente, sem prestar atenção no que estou fazendo.",
    "Normalmente, quando tenho pensamentos ruins ou imagens estressantes, eu me julgo como bom ou mau, dependendo do tipo de imagens ou pensamentos.",
    "Eu presto atenção em como minhas emoções afetam meus pensamentos e comportamento.",
    "Normalmente eu consigo descrever detalhadamente como me sinto no momento presente.",
    "Eu me pego fazendo coisas sem prestar atenção a elas.",
    "Eu me reprovo quando tenho ideias irracionais."
];

export async function seedFfmq(prisma: PrismaClient) {
  // Cria o questionário FFMQ
  const questionnaire = await prisma.questionario.create({
    data: {
      nome: "FFMQ",
      quantidade_questoes: ffmqQuestionsText.length,
      perguntas: {
        create: ffmqQuestionsText.map((texto, idx) => ({
          texto,
          numero: idx + 1,
        })),
      },
    },
    include: { perguntas: true },
  });
  console.log("✅ Questionário FFMQ criado:", questionnaire.nome);
}
