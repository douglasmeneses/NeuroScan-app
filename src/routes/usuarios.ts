import { Router } from 'express';
import {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} from '../controllers/usuarioController';

const router = Router();

/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Listar todos os usuários
 *     description: Retorna uma lista com todos os usuários cadastrados
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', listarUsuarios);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   get:
 *     tags:
 *       - Usuários
 *     summary: Buscar usuário por ID
 *     description: Retorna os detalhes de um usuário específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Usuário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', buscarUsuarioPorId);

/**
 * @openapi
 * /api/usuarios:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Criar novo usuário
 *     description: Cria um novo usuário no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iniciais_do_nome
 *               - idade
 *             properties:
 *               iniciais_do_nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 10
 *                 description: Iniciais do nome do usuário (2-10 caracteres)
 *                 example: "JDS"
 *               idade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 description: Idade do usuário
 *                 example: 25
 *           example:
 *             iniciais_do_nome: "JDS"
 *             idade: 25
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Dados inválidos"
 *               detalhes: "Campo 'iniciais_do_nome' é obrigatório"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', criarUsuario);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   put:
 *     tags:
 *       - Usuários
 *     summary: Atualizar usuário completamente
 *     description: Atualiza todos os dados de um usuário (substituição completa)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iniciais_do_nome
 *               - idade
 *             properties:
 *               iniciais_do_nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 10
 *                 description: Iniciais do nome do usuário
 *                 example: "JDS"
 *               idade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 description: Idade do usuário
 *                 example: 26
 *           example:
 *             iniciais_do_nome: "JDS"
 *             idade: 26
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     tags:
 *       - Usuários
 *     summary: Atualizar usuário parcialmente
 *     description: Atualiza apenas os campos fornecidos de um usuário
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               iniciais_do_nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 10
 *                 description: Iniciais do nome do usuário
 *               idade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 description: Idade do usuário
 *           examples:
 *             atualizarIdade:
 *               summary: Atualizar apenas a idade
 *               value:
 *                 idade: 27
 *             atualizarNome:
 *               summary: Atualizar apenas as iniciais
 *               value:
 *                 iniciais_do_nome: "ABC"
 *             atualizarAmbos:
 *               summary: Atualizar ambos os campos
 *               value:
 *                 iniciais_do_nome: "ABC"
 *                 idade: 27
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', atualizarUsuario);
router.patch('/:id', atualizarUsuario);

/**
 * @openapi
 * /api/usuarios/{id}:
 *   delete:
 *     tags:
 *       - Usuários
 *     summary: Deletar usuário
 *     description: Remove um usuário do sistema permanentemente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser deletado
 *         example: 1
 *     responses:
 *       204:
 *         description: Usuário deletado com sucesso (sem conteúdo de retorno)
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Usuário não encontrado"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', deletarUsuario);

export default router;


