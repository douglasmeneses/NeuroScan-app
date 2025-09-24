import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

// Listar todos os usuários
router.get('/', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar usuário por ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const prisma: PrismaClient = (req as any).prisma;
    const { id } = req.params;
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
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
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;

