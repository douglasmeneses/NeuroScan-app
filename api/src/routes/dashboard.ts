import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

/**
 * @openapi
 * /api/dashboard/stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Estatísticas gerais do sistema
 *     description: Retorna contadores gerais de usuários, questionários e respostas cadastrados
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsuarios:
 *                   type: integer
 *                   description: Total de usuários cadastrados
 *                   example: 15
 *                 totalQuestionarios:
 *                   type: integer
 *                   description: Total de questionários cadastrados
 *                   example: 3
 *                 totalRespostas:
 *                   type: integer
 *                   description: Total de respostas cadastradas
 *                   example: 245
 *             example:
 *               totalUsuarios: 15
 *               totalQuestionarios: 3
 *               totalRespostas: 245
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Estatísticas gerais do dashboard
router.get('/stats', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    
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
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/dashboard/tempo-questionarios:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Tempo médio por pergunta
 *     description: Retorna estatísticas de tempo agregadas por pergunta, incluindo média, total e quantidade de respostas
 *     responses:
 *       200:
 *         description: Estatísticas de tempo retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pergunta_id:
 *                     type: integer
 *                     description: ID da pergunta
 *                     example: 1
 *                   pergunta_numero:
 *                     type: integer
 *                     description: Número da pergunta no questionário
 *                     example: 1
 *                   pergunta_texto:
 *                     type: string
 *                     description: Texto da pergunta
 *                     example: "Qual é a sua idade?"
 *                   questionario_nome:
 *                     type: string
 *                     description: Nome do questionário
 *                     example: "Questionário de Perfil"
 *                   tempo_medio:
 *                     type: number
 *                     format: float
 *                     description: Tempo médio de resposta em segundos
 *                     example: 12.5
 *                   tempo_total:
 *                     type: number
 *                     format: float
 *                     description: Tempo total acumulado em segundos
 *                     example: 187.5
 *                   total_respostas:
 *                     type: integer
 *                     description: Quantidade de respostas recebidas
 *                     example: 15
 *             example:
 *               - pergunta_id: 1
 *                 pergunta_numero: 1
 *                 pergunta_texto: "Qual é a sua idade?"
 *                 questionario_nome: "Questionário de Perfil"
 *                 tempo_medio: 12.5
 *                 tempo_total: 187.5
 *                 total_respostas: 15
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Tempo médio por questionário
router.get('/tempo-questionarios', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    
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
  } catch (error) {
    console.error('Erro ao buscar tempo por questionários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/dashboard/usuarios-stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Estatísticas agregadas por usuário
 *     description: Retorna dados agregados de interação de cada usuário (cliques, passos, tempo total, etc.)
 *     responses:
 *       200:
 *         description: Estatísticas de usuários retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do usuário
 *                     example: 1
 *                   iniciais_do_nome:
 *                     type: string
 *                     description: Iniciais do nome do usuário
 *                     example: "JDS"
 *                   idade:
 *                     type: integer
 *                     description: Idade do usuário
 *                     example: 25
 *                   total_respostas:
 *                     type: integer
 *                     description: Total de respostas do usuário
 *                     example: 10
 *                   total_cliques:
 *                     type: integer
 *                     description: Soma total de cliques
 *                     example: 45
 *                   total_passos:
 *                     type: integer
 *                     description: Soma total de passos
 *                     example: 120
 *                   tempo_total:
 *                     type: number
 *                     format: float
 *                     description: Tempo total acumulado em segundos
 *                     example: 125.5
 *                   tempo_idle_total:
 *                     type: number
 *                     format: float
 *                     description: Tempo total em idle em segundos
 *                     example: 30.4
 *                   tempo_medio_por_resposta:
 *                     type: number
 *                     format: float
 *                     description: Tempo médio por resposta em segundos
 *                     example: 12.55
 *             example:
 *               - id: 1
 *                 iniciais_do_nome: "JDS"
 *                 idade: 25
 *                 total_respostas: 10
 *                 total_cliques: 45
 *                 total_passos: 120
 *                 tempo_total: 125.5
 *                 tempo_idle_total: 30.4
 *                 tempo_medio_por_resposta: 12.55
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Dados agregados por usuário
router.get('/usuarios-stats', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    
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
  } catch (error) {
    console.error('Erro ao buscar estatísticas de usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/dashboard/graficos-respostas:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Dados para gráficos de interação
 *     description: |
 *       Retorna dados estruturados para visualização em gráficos, incluindo:
 *       - Cliques por resposta
 *       - Passos por resposta
 *       - Duração por resposta
 *       
 *       Todos os dados incluem contexto de usuário, questionário e pergunta.
 *     responses:
 *       200:
 *         description: Dados dos gráficos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cliques:
 *                   type: array
 *                   description: Dados de cliques por resposta
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       usuario:
 *                         type: string
 *                         example: "JDS"
 *                       questionario:
 *                         type: string
 *                         example: "Questionário de Perfil"
 *                       pergunta:
 *                         type: integer
 *                         example: 1
 *                       valor:
 *                         type: integer
 *                         example: 7
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-27T13:50:53.084Z"
 *                 passos:
 *                   type: array
 *                   description: Dados de passos por resposta
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       usuario:
 *                         type: string
 *                       questionario:
 *                         type: string
 *                       pergunta:
 *                         type: integer
 *                       valor:
 *                         type: integer
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                 duracao:
 *                   type: array
 *                   description: Dados de duração por resposta
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       usuario:
 *                         type: string
 *                       questionario:
 *                         type: string
 *                       pergunta:
 *                         type: integer
 *                       valor:
 *                         type: number
 *                         format: float
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *             example:
 *               cliques:
 *                 - id: 1
 *                   usuario: "JDS"
 *                   questionario: "Questionário de Perfil"
 *                   pergunta: 1
 *                   valor: 7
 *                   timestamp: "2025-01-27T13:50:53.084Z"
 *               passos:
 *                 - id: 1
 *                   usuario: "JDS"
 *                   questionario: "Questionário de Perfil"
 *                   pergunta: 1
 *                   valor: 0
 *                   timestamp: "2025-01-27T13:50:53.084Z"
 *               duracao:
 *                 - id: 1
 *                   usuario: "JDS"
 *                   questionario: "Questionário de Perfil"
 *                   pergunta: 1
 *                   valor: 8.2
 *                   timestamp: "2025-01-27T13:50:53.084Z"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Dados para gráficos de cliques, passos e duração por resposta
router.get('/graficos-respostas', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    
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
  } catch (error) {
    console.error('Erro ao buscar dados para gráficos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;


