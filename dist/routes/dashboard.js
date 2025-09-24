"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Estatísticas gerais do dashboard
router.get('/stats', async (req, res) => {
    try {
        const prisma = req.prisma;
        const [totalUsuarios, totalQuestionarios, totalRespostas] = await Promise.all([
            prisma.usuario.count(),
            prisma.questionario.count(),
            prisma.resposta.count()
        ]);
        res.json({
            totalUsuarios,
            totalQuestionarios,
            totalRespostas
        });
    }
    catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
// Tempo médio por questionário
router.get('/tempo-questionarios', async (req, res) => {
    try {
        const prisma = req.prisma;
        const temposPorQuestionario = await prisma.resposta.groupBy({
            by: ['pergunta_id'],
            _avg: {
                duracao: true
            },
            _sum: {
                duracao: true
            },
            _count: {
                id: true
            }
        });
        // Buscar informações das perguntas e questionários
        const perguntasIds = temposPorQuestionario.map(t => t.pergunta_id);
        const perguntas = await prisma.pergunta.findMany({
            where: {
                id: {
                    in: perguntasIds
                }
            },
            include: {
                questionario: true
            }
        });
        const resultado = temposPorQuestionario.map(tempo => {
            const pergunta = perguntas.find(p => p.id === tempo.pergunta_id);
            return {
                pergunta_id: tempo.pergunta_id,
                pergunta_numero: pergunta?.numero,
                pergunta_texto: pergunta?.texto,
                questionario_nome: pergunta?.questionario.nome,
                tempo_medio: tempo._avg.duracao,
                tempo_total: tempo._sum.duracao,
                total_respostas: tempo._count.id
            };
        });
        res.json(resultado);
    }
    catch (error) {
        console.error('Erro ao buscar tempo por questionários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
// Dados agregados por usuário
router.get('/usuarios-stats', async (req, res) => {
    try {
        const prisma = req.prisma;
        const usuariosStats = await prisma.usuario.findMany({
            include: {
                respostas: {
                    include: {
                        pergunta: {
                            include: {
                                questionario: true
                            }
                        }
                    }
                }
            }
        });
        const resultado = usuariosStats.map(usuario => {
            const totalCliques = usuario.respostas.reduce((sum, r) => sum + r.quantidade_cliques, 0);
            const totalPassos = usuario.respostas.reduce((sum, r) => sum + r.quantidade_passos, 0);
            const tempoTotal = usuario.respostas.reduce((sum, r) => sum + r.duracao, 0);
            const tempoIdleTotal = usuario.respostas.reduce((sum, r) => sum + r.idle, 0);
            return {
                id: usuario.id,
                iniciais_do_nome: usuario.iniciais_do_nome,
                idade: usuario.idade,
                total_respostas: usuario.respostas.length,
                total_cliques: totalCliques,
                total_passos: totalPassos,
                tempo_total: tempoTotal,
                tempo_idle_total: tempoIdleTotal,
                tempo_medio_por_resposta: usuario.respostas.length > 0 ? tempoTotal / usuario.respostas.length : 0
            };
        });
        res.json(resultado);
    }
    catch (error) {
        console.error('Erro ao buscar estatísticas de usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
// Dados para gráficos de cliques, passos e duração por resposta
router.get('/graficos-respostas', async (req, res) => {
    try {
        const prisma = req.prisma;
        const respostas = await prisma.resposta.findMany({
            include: {
                usuario: true,
                pergunta: {
                    include: {
                        questionario: true
                    }
                }
            },
            orderBy: {
                dh_inicio: 'asc'
            }
        });
        const dadosGraficos = {
            cliques: respostas.map(r => ({
                id: r.id,
                usuario: r.usuario.iniciais_do_nome,
                questionario: r.pergunta.questionario.nome,
                pergunta: r.pergunta.numero,
                valor: r.quantidade_cliques,
                timestamp: r.dh_inicio
            })),
            passos: respostas.map(r => ({
                id: r.id,
                usuario: r.usuario.iniciais_do_nome,
                questionario: r.pergunta.questionario.nome,
                pergunta: r.pergunta.numero,
                valor: r.quantidade_passos,
                timestamp: r.dh_inicio
            })),
            duracao: respostas.map(r => ({
                id: r.id,
                usuario: r.usuario.iniciais_do_nome,
                questionario: r.pergunta.questionario.nome,
                pergunta: r.pergunta.numero,
                valor: r.duracao,
                timestamp: r.dh_inicio
            }))
        };
        res.json(dadosGraficos);
    }
    catch (error) {
        console.error('Erro ao buscar dados para gráficos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map