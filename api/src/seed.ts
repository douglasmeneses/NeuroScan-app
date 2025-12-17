import { PrismaClient } from "@prisma/client";
import { seedDass21 } from "./seeds/seed_dass21";
import { seedFfmq } from "./seeds/seed_ffmq";
import { seedCapc } from "./seeds/seed_capc";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpa todos os dados existentes
  console.log("🗑️  Limpando dados existentes...");
  await prisma.acelerometro.deleteMany();
  await prisma.giroscopio.deleteMany();
  await prisma.coleta.deleteMany();
  await prisma.resposta.deleteMany();
  await prisma.pergunta.deleteMany();
  await prisma.questionario.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("✅ Dados limpos!");

  // Executa seeds na ordem especificada
  console.log("\n📝 Executando seeds dos questionários...");
  
  console.log("\n1️⃣ DASS21...");
  await seedDass21(prisma);
  
  console.log("\n2️⃣ FFMQ...");
  await seedFfmq(prisma);
  
  console.log("\n3️⃣ CAPC...");
  await seedCapc(prisma);

  console.log("\n✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
