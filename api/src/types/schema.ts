import { z } from "zod";

// Usuario schemas
export const createUsuarioSchema = z.object({
  iniciais_do_nome: z.string().min(1).max(10),
  idade: z.number().int().positive().min(1).max(150),
  sexo: z.enum(["M", "F", "O"]).optional(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido").optional(),
  renda_mensal: z.number().positive().optional(),
  estado_civil: z.string().min(1).optional(),
  ocupacao: z.string().min(1).optional(),
  carga_horaria_semanal: z.number().int().positive().optional(),
  escolaridade: z.string().min(1).optional(),
  estado: z.string().length(2).optional(),
  faz_tratamento_psicologico: z.boolean().optional(),
  tratamentos: z.string().optional(),
  toma_medicacao_psiquiatrica: z.boolean().optional(),
  medicacoes: z.string().optional(),
});

export const updateUsuarioSociodemograficoSchema = z.object({
  sexo: z.enum(["M", "F", "O"]),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
  renda_mensal: z.number().positive(),
  estado_civil: z.string().min(1),
  ocupacao: z.string().min(1),
  carga_horaria_semanal: z.number().int().positive(),
  escolaridade: z.string().min(1),
  estado: z.string().length(2),
  faz_tratamento_psicologico: z.boolean(),
  tratamentos: z.string().optional(),
  toma_medicacao_psiquiatrica: z.boolean(),
  medicacoes: z.string().optional(),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioSociodemograficoInput = z.infer<typeof updateUsuarioSociodemograficoSchema>;

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
