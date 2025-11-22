import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

/**
 * @openapi
 * /api/questionarios:
 *   get:
 *     tags:
 *       - Questionários
 *     summary: Listar todos os questionários
 *     description: Retorna uma lista com todos os questionários cadastrados, incluindo suas perguntas ordenadas por número
 *     responses:
 *       200:
 *         description: Lista de questionários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Questionario'
 *             example:
 *               - id: 1
 *                 nome: "Questionário de Perfil"
 *                 perguntas:
 *                   - id: 1
 *                     numero: 1
 *                     texto: "Qual é a sua idade?"
 *                     questionario_id: 1
 *                   - id: 2
 *                     numero: 2
 *                     texto: "Qual é o seu sexo?"
 *                     questionario_id: 1
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Listar todos os questionários
router.get('/', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const questionarios = await prisma.questionario.findMany({
      include: {
        perguntas: {
          orderBy: {
            numero: 'asc'
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
    res.json(questionarios);
  } catch (error) {
    console.error('Erro ao buscar questionários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * @openapi
 * /api/questionarios/{id}:
 *   get:
 *     tags:
 *       - Questionários
 *     summary: Buscar questionário por ID
 *     description: Retorna os detalhes de um questionário específico com todas as suas perguntas ordenadas por número
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do questionário
 *         example: 1
 *     responses:
 *       200:
 *         description: Questionário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Questionario'
 *             example:
 *               id: 1
 *               nome: "Questionário de Perfil"
 *               perguntas:
 *                 - id: 1
 *                   numero: 1
 *                   texto: "Qual é a sua idade?"
 *                   questionario_id: 1
 *                 - id: 2
 *                   numero: 2
 *                   texto: "Qual é o seu sexo?"
 *                   questionario_id: 1
 *       404:
 *         description: Questionário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Questionário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Buscar questionário por ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const { id } = req.params;
    
    const questionario = await prisma.questionario.findUnique({
      where: { id: parseInt(id) },
      include: {
        perguntas: {
          orderBy: {
            numero: 'asc'
          }
        }
      }
    });
    
    if (!questionario) {
      return res.status(404).json({ error: 'Questionário não encontrado' });
    }
    
    res.json(questionario);
  } catch (error) {
    console.error('Erro ao buscar questionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;


