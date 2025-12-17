-- CreateTable
CREATE TABLE "gonogos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "erros_comissao_percentual" DOUBLE PRECISION NOT NULL,
    "erros_omissao_percentual" DOUBLE PRECISION NOT NULL,
    "acerto_go_percentual" DOUBLE PRECISION NOT NULL,
    "tempo_medio_reacao_ms" DOUBLE PRECISION NOT NULL,
    "variabilidade_rt_ms" DOUBLE PRECISION NOT NULL,
    "latencia_media_nogo_erro" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gonogos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gonogos" ADD CONSTRAINT "gonogos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
