-- CreateTable
CREATE TABLE "dados_sociodemograficos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "sexo" CHAR(1) NOT NULL,
    "email" TEXT NOT NULL,
    "renda_mensal" DECIMAL(10,2) NOT NULL,
    "estado_civil" TEXT NOT NULL,
    "ocupacao" TEXT NOT NULL,
    "carga_horaria_semanal" INTEGER NOT NULL,
    "escolaridade" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" CHAR(2) NOT NULL,
    "faz_tratamento_psicologico" BOOLEAN NOT NULL,
    "tratamentos" TEXT,
    "toma_medicacao_psiquiatrica" BOOLEAN NOT NULL,
    "medicacoes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "dados_sociodemograficos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dados_sociodemograficos_usuario_id_key" ON "dados_sociodemograficos"("usuario_id");

-- AddForeignKey
ALTER TABLE "dados_sociodemograficos" ADD CONSTRAINT "dados_sociodemograficos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
