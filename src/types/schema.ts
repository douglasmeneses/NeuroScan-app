import { z } from "zod";

// Usuario schemas
export const createUsuarioSchema = z.object({
  iniciais_do_nome: z.string().min(1).max(10),
  idade: z.number().int().positive().min(1).max(150),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;

// Resposta schemas
export const createRespostaSchema = z.object({
  usuario_id: z.number().int().positive(),
  pergunta_id: z.number().int().positive(),
  resposta: z.union([z.string(), z.number()]).transform(String),
  duracao: z.number().min(0),
  idle: z.number().min(0),
  quantidade_cliques: z.number().int().min(0),
  quantidade_passos: z.number().int().min(0),
  dh_inicio: z.coerce.date(),
  dh_fim: z.coerce.date(),
  dados_sensores: z
    .array(
      z.object({
        timestamp: z.coerce.date(),
        acelerometro: z
          .object({
            eixo_x: z.number(),
            eixo_y: z.number(),
            eixo_z: z.number(),
          })
          .optional(),
        giroscopio: z
          .object({
            eixo_x: z.number(),
            eixo_y: z.number(),
            eixo_z: z.number(),
          })
          .optional(),
      })
    )
    .optional()
    .default([]),
});

export type CreateRespostaInput = z.infer<typeof createRespostaSchema>;
