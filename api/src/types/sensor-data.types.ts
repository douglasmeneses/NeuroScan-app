import { z } from "zod";

// Formato compacto para otimização de tamanho e performance
export interface SensorDataCompact {
  usuario_id: number;
  pergunta_id: number;
  resposta: number;
  duracao: number;
  idle: number;
  quantidade_cliques: number;
  quantidade_passos: number;
  timestamp_inicial: number; // Unix timestamp em ms
  frequencia_hz?: number; // frequência de amostragem (opcional)
  sensores: number[][]; // [offset_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z]
}

// Formato expandido (original)
export interface SensorDataExpanded {
  usuario_id: number;
  pergunta_id: number;
  resposta: number;
  duracao: number;
  idle: number;
  quantidade_cliques: number;
  quantidade_passos: number;
  dh_inicio: Date | string;
  dh_fim: Date | string;
  dados_sensores: {
    timestamp: Date | string;
    acelerometro: {
      eixo_x: number;
      eixo_y: number;
      eixo_z: number;
    };
    giroscopio: {
      eixo_x: number;
      eixo_y: number;
      eixo_z: number;
    };
  }[];
}

// Schema Zod para validação do formato compacto
export const CompactSensorDataSchema = z.object({
  usuario_id: z.number().int().positive(),
  pergunta_id: z.number().int().positive(),
  resposta: z.number().int(),
  duracao: z.number(),
  idle: z.number(),
  quantidade_cliques: z.number().int(),
  quantidade_passos: z.number().int(),
  timestamp_inicial: z.number().int().positive(),
  frequencia_hz: z.number().positive().optional(),
  sensores: z.array(
    z.tuple([
      z.number(), // offset_ms desde timestamp_inicial
      z.number(), // acelerometro_x
      z.number(), // acelerometro_y
      z.number(), // acelerometro_z
      z.number(), // giroscopio_x
      z.number(), // giroscopio_y
      z.number(), // giroscopio_z
    ])
  ).min(1),
});

export type CompactSensorDataValidated = z.infer<typeof CompactSensorDataSchema>;
