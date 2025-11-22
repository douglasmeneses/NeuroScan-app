-- CreateTable
CREATE TABLE "questionarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade_questoes" INTEGER NOT NULL,

    CONSTRAINT "questionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perguntas" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "questionario_id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "perguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "iniciais_do_nome" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" SERIAL NOT NULL,
    "pergunta_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "resposta" TEXT,
    "duracao" INTEGER NOT NULL,
    "idle" INTEGER NOT NULL,
    "quantidade_cliques" INTEGER NOT NULL,
    "quantidade_passos" INTEGER NOT NULL,
    "dh_inicio" TIMESTAMP(3) NOT NULL,
    "dh_fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coletas" (
    "id" SERIAL NOT NULL,
    "resposta_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coletas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acelerometros" (
    "id" SERIAL NOT NULL,
    "coleta_id" INTEGER NOT NULL,
    "eixo_x" DOUBLE PRECISION NOT NULL,
    "eixo_y" DOUBLE PRECISION NOT NULL,
    "eixo_z" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "acelerometros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "giroscopios" (
    "id" SERIAL NOT NULL,
    "coleta_id" INTEGER NOT NULL,
    "eixo_x" DOUBLE PRECISION NOT NULL,
    "eixo_y" DOUBLE PRECISION NOT NULL,
    "eixo_z" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "giroscopios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acelerometros_coleta_id_key" ON "acelerometros"("coleta_id");

-- CreateIndex
CREATE UNIQUE INDEX "giroscopios_coleta_id_key" ON "giroscopios"("coleta_id");

-- AddForeignKey
ALTER TABLE "perguntas" ADD CONSTRAINT "perguntas_questionario_id_fkey" FOREIGN KEY ("questionario_id") REFERENCES "questionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_pergunta_id_fkey" FOREIGN KEY ("pergunta_id") REFERENCES "perguntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respostas" ADD CONSTRAINT "respostas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coletas" ADD CONSTRAINT "coletas_resposta_id_fkey" FOREIGN KEY ("resposta_id") REFERENCES "respostas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acelerometros" ADD CONSTRAINT "acelerometros_coleta_id_fkey" FOREIGN KEY ("coleta_id") REFERENCES "coletas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "giroscopios" ADD CONSTRAINT "giroscopios_coleta_id_fkey" FOREIGN KEY ("coleta_id") REFERENCES "coletas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
