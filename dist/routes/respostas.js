"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const express_1 = require("express");
const router = (0, express_1.Router)();
// Listar todas as respostas
router.get("/", async (req, res) => {
    try {
        const prisma = req.prisma;
        const respostas = await prisma.resposta.findMany({
            include: {
                usuario: true,
                pergunta: {
                    include: {
                        questionario: true,
                    },
                },
            },
            orderBy: {
                dh_inicio: "desc",
            },
        });
        res.json(respostas);
    }
    catch (error) {
        console.error("Erro ao buscar respostas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// Endpoint para criar resposta e dados dos sensores
router.post("/", async (req, res) => {
    // Esquema de validação com Zod
    const isoDateTime = zod_1.z
        .string()
        .refine((val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/.test(val), { message: "Invalid ISO datetime" });
    const sensorSchema = zod_1.z.object({
        timestamp: isoDateTime,
        acelerometro: zod_1.z
            .object({
            eixo_x: zod_1.z.number(),
            eixo_y: zod_1.z.number(),
            eixo_z: zod_1.z.number(),
        })
            .optional(),
        giroscopio: zod_1.z
            .object({
            eixo_x: zod_1.z.number(),
            eixo_y: zod_1.z.number(),
            eixo_z: zod_1.z.number(),
        })
            .optional(),
    });
    const bodySchema = zod_1.z.object({
        usuario_id: zod_1.z.number(),
        pergunta_id: zod_1.z.number(),
        resposta: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]),
        duracao: zod_1.z.number(),
        idle: zod_1.z.number(),
        quantidade_cliques: zod_1.z.number(),
        quantidade_passos: zod_1.z.number(),
        dh_inicio: isoDateTime,
        dh_fim: isoDateTime,
        dados_sensores: zod_1.z.array(sensorSchema),
    });
    const parseResult = bodySchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ error: "Dados inválidos", details: parseResult.error.issues });
    }
    const { usuario_id, pergunta_id, resposta, duracao, idle, quantidade_cliques, quantidade_passos, dh_inicio, dh_fim, dados_sensores, } = parseResult.data;
    try {
        const prisma = req.prisma;
        // Cria a resposta
        // Garante que dh_inicio e dh_fim são datas válidas
        const dhInicioDate = dh_inicio ? new Date(dh_inicio) : null;
        const dhFimDate = dh_fim ? new Date(dh_fim) : null;
        if (!dhInicioDate ||
            isNaN(dhInicioDate.getTime()) ||
            !dhFimDate ||
            isNaN(dhFimDate.getTime())) {
            return res.status(400).json({ error: "dh_inicio ou dh_fim inválido" });
        }
        // Converte para formato ISO string se o campo no banco for do tipo string,
        // ou mantém como Date se o campo for do tipo timestamp/date.
        // O erro indica que o tipo enviado não bate com o esperado pelo banco.
        // Para campos do tipo timestamp/date no Postgres, envie um Date.
        const respostaCriada = await prisma.resposta.create({
            data: {
                usuario_id: Number(usuario_id),
                pergunta_id: Number(pergunta_id),
                resposta: resposta?.toString(),
                duracao: Number(duracao),
                idle: Number(idle),
                quantidade_cliques: Number(quantidade_cliques),
                quantidade_passos: Number(quantidade_passos),
                dh_inicio: dhInicioDate instanceof Date ? dhInicioDate : new Date(dhInicioDate),
                dh_fim: dhFimDate instanceof Date ? dhFimDate : new Date(dhFimDate),
            },
        });
        // Nova estrutura: dados_sensores é um array de objetos { timestamp, acelerometro, giroscopio }
        if (Array.isArray(dados_sensores)) {
            for (const sensor of dados_sensores) {
                const coleta = await prisma.coleta.create({
                    data: {
                        resposta_id: respostaCriada.id,
                        timestamp: new Date(sensor.timestamp),
                    },
                });
                if (sensor.acelerometro) {
                    await prisma.acelerometro.create({
                        data: {
                            coleta_id: coleta.id,
                            eixo_x: sensor.acelerometro.eixo_x,
                            eixo_y: sensor.acelerometro.eixo_y,
                            eixo_z: sensor.acelerometro.eixo_z,
                        },
                    });
                }
                if (sensor.giroscopio) {
                    await prisma.giroscopio.create({
                        data: {
                            coleta_id: coleta.id,
                            eixo_x: sensor.giroscopio.eixo_x,
                            eixo_y: sensor.giroscopio.eixo_y,
                            eixo_z: sensor.giroscopio.eixo_z,
                        },
                    });
                }
            }
        }
        res.status(201).json({ id: respostaCriada.id });
    }
    catch (error) {
        console.error("Erro ao criar resposta:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// Buscar resposta por ID com dados dos sensores
router.get("/:id", async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const resposta = await prisma.resposta.findUnique({
            where: { id: parseInt(id) },
            include: {
                usuario: true,
                pergunta: {
                    include: {
                        questionario: true,
                    },
                },
                coletas: {
                    include: {
                        acelerometro: true,
                        giroscopio: true,
                    },
                    orderBy: {
                        timestamp: "asc",
                    },
                },
            },
        });
        if (!resposta) {
            return res.status(404).json({ error: "Resposta não encontrada" });
        }
        res.json(resposta);
    }
    catch (error) {
        console.error("Erro ao buscar resposta:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
// Buscar dados dos sensores por resposta
router.get("/:id/sensores", async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const coletas = await prisma.coleta.findMany({
            where: { resposta_id: parseInt(id) },
            include: {
                acelerometro: true,
                giroscopio: true,
            },
            orderBy: {
                timestamp: "asc",
            },
        });
        res.json(coletas);
    }
    catch (error) {
        console.error("Erro ao buscar dados dos sensores:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});
exports.default = router;
//# sourceMappingURL=respostas.js.map