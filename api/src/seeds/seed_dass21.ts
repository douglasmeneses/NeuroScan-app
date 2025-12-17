import { PrismaClient } from "@prisma/client";

const dassQuestionsText = [
    "Achei difícil me acalmar?",
    "Senti minha boca seca?",
    "Não consegui vivenciar nenhum sentimento positivo?",
    "Tive dificuldade em respirar em alguns momentos? (ex. respiração ofegante, falta de ar, sem ter feito nenhum esforço físico)",
    "Achei difícil ter iniciativa para fazer as coisas?",
    "Tive a tendência de reagir de forma exagerada às situações?",
    "Senti tremores (ex. nas mãos)?",
    "Senti que estava sempre nervoso?",
    "Preocupei-me com situações em que eu pudesse entrar em pânico e parecesse ridículo.",
    "Senti que não tinha nada a desejar?",
    "Senti-me agitado?",
    "Achei difícil relaxar?",
    "Senti-me depressivo (a) e sem ânimo?",
    "Fui intolerante com as coisas que me impediam de continuar o que eu estava fazendo.",
    "Senti que ia entrar em pânico?",
    "Não consegui me entusiasmar com nada",
    "Senti que não tinha valor como pessoa?",
    "Senti que estava um pouco emotivo/sensível demais?",
    "Sabia que meu coração estava alterado mesmo não tendo feito nenhum esforço físico (ex. aumento da frequência cardíaca, disritmia cardíaca)?",
    "Senti medo sem motivo?",
    "Senti que a vida não tinha sentido."
];

export async function seedDass21(prisma: PrismaClient) {
  // Cria o questionário DASS21
  const questionnaire = await prisma.questionario.create({
    data: {
      nome: "DASS21",
      quantidade_questoes: dassQuestionsText.length,
      perguntas: {
        create: dassQuestionsText.map((texto, idx) => ({
          texto,
          numero: idx + 1,
        })),
      },
    },
    include: { perguntas: true },
  });
  console.log("✅ Questionário DASS21 criado:", questionnaire.nome);
}
