/*
  Warnings:

  - You are about to drop the `dados_sociodemograficos` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `resposta` on table `respostas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "acelerometros" DROP CONSTRAINT "acelerometros_coleta_id_fkey";

-- DropForeignKey
ALTER TABLE "coletas" DROP CONSTRAINT "coletas_resposta_id_fkey";

-- DropForeignKey
ALTER TABLE "dados_sociodemograficos" DROP CONSTRAINT "dados_sociodemograficos_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "giroscopios" DROP CONSTRAINT "giroscopios_coleta_id_fkey";

-- DropForeignKey
ALTER TABLE "perguntas" DROP CONSTRAINT "perguntas_questionario_id_fkey";

-- DropForeignKey
ALTER TABLE "respostas" DROP CONSTRAINT "respostas_pergunta_id_fkey";

-- DropForeignKey
ALTER TABLE "respostas" DROP CONSTRAINT "respostas_usuario_id_fkey";

-- AlterTable
ALTER TABLE "coletas" ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "respostas" ALTER COLUMN "resposta" SET NOT NULL,
ALTER COLUMN "duracao" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "idle" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "dh_inicio" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "dh_fim" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "carga_horaria_semanal" INTEGER,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "escolaridade" TEXT,
ADD COLUMN     "estado" CHAR(2),
ADD COLUMN     "estado_civil" TEXT,
ADD COLUMN     "faz_tratamento_psicologico" BOOLEAN,
ADD COLUMN     "medicacoes" TEXT,
ADD COLUMN     "ocupacao" TEXT,
ADD COLUMN     "renda_mensal" DECIMAL(10,2),
ADD COLUMN     "sexo" CHAR(1),
ADD COLUMN     "toma_medicacao_psiquiatrica" BOOLEAN,
ADD COLUMN     "tratamentos" TEXT,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "dados_sociodemograficos";

-- AddForeignKey
ALTER TABLE "perguntas" ADD CONSTRAINT "perguntas_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coletas" ADD CONSTRAINT "coletas_resposta_id_fkey" FOREIGN KEY ("resposta_id") REFERENCES "respostas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acelerometros" ADD CONSTRAINT "acelerometros_coleta_id_fkey" FOREIGN KEY ("coleta_id") REFERENCES "coletas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giroscopios" ADD CONSTRAINT "giroscopios_coleta_id_fkey" FOREIGN KEY ("coleta_id") REFERENCES "coletas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
