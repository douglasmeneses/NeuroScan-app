import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

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

