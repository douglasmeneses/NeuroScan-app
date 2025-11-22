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
 *     description: Cria um novo usuário no sistema com dados básicos e opcionalmente dados sociodemográficos
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
 *               sexo:
 *                 type: string
 *                 enum: [M, F, O]
 *                 description: Sexo do usuário
 *                 example: "M"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@example.com"
 *               renda_mensal:
 *                 type: number
 *                 format: float
 *                 description: Renda mensal em reais
 *                 example: 3500.50
 *               estado_civil:
 *                 type: string
 *                 description: Estado civil
 *                 example: "Solteiro(a)"
 *               ocupacao:
 *                 type: string
 *                 description: Ocupação profissional
 *                 example: "Desenvolvedor"
 *               carga_horaria_semanal:
 *                 type: integer
 *                 description: Carga horária de trabalho semanal
 *                 example: 40
 *               escolaridade:
 *                 type: string
 *                 description: Nível de escolaridade
 *                 example: "Superior Completo"
 *               estado:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: Estado (UF)
 *                 example: "SP"
 *               faz_tratamento_psicologico:
 *                 type: boolean
 *                 description: Se faz tratamento psicológico
 *                 example: false
 *               tratamentos:
 *                 type: string
 *                 description: Descrição dos tratamentos psicológicos
 *                 example: "Terapia cognitivo-comportamental"
 *               toma_medicacao_psiquiatrica:
 *                 type: boolean
 *                 description: Se toma medicação psiquiátrica
 *                 example: false
 *               medicacoes:
 *                 type: string
 *                 description: Descrição das medicações
 *                 example: "Sertralina 50mg"
 *           examples:
 *             basico:
 *               summary: Apenas dados básicos
 *               value:
 *                 iniciais_do_nome: "JDS"
 *                 idade: 25
 *             completo:
 *               summary: Com dados sociodemográficos
 *               value:
 *                 iniciais_do_nome: "JDS"
 *                 idade: 25
 *                 sexo: "M"
 *                 email: "joao@example.com"
 *                 renda_mensal: 3500.50
 *                 estado_civil: "Solteiro(a)"
 *                 ocupacao: "Desenvolvedor"
 *                 carga_horaria_semanal: 40
 *                 escolaridade: "Superior Completo"
 *                 estado: "SP"
 *                 faz_tratamento_psicologico: false
 *                 toma_medicacao_psiquiatrica: false
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
 *             properties:
 *               iniciais_do_nome:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 10
 *                 example: "JDS"
 *               idade:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 120
 *                 example: 26
 *               sexo:
 *                 type: string
 *                 enum: [M, F, O]
 *                 example: "M"
 *               email:
 *                 type: string
 *                 example: "joao@example.com"
 *               renda_mensal:
 *                 type: number
 *                 example: 3500.50
 *               estado_civil:
 *                 type: string
 *                 example: "Casado(a)"
 *               ocupacao:
 *                 type: string
 *                 example: "Desenvolvedor"
 *               carga_horaria_semanal:
 *                 type: integer
 *                 example: 40
 *               escolaridade:
 *                 type: string
 *                 example: "Superior Completo"
 *               estado:
 *                 type: string
 *                 example: "SP"
 *               faz_tratamento_psicologico:
 *                 type: boolean
 *                 example: false
 *               tratamentos:
 *                 type: string
 *                 example: "Terapia"
 *               toma_medicacao_psiquiatrica:
 *                 type: boolean
 *                 example: false
 *               medicacoes:
 *                 type: string
 *                 example: "Sertralina"
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
 *               sexo:
 *                 type: string
 *                 enum: [M, F, O]
 *                 description: Sexo
 *               email:
 *                 type: string
 *                 description: Email
 *               renda_mensal:
 *                 type: number
 *                 description: Renda mensal
 *               estado_civil:
 *                 type: string
 *                 description: Estado civil
 *               ocupacao:
 *                 type: string
 *                 description: Ocupação
 *               carga_horaria_semanal:
 *                 type: integer
 *                 description: Carga horária semanal
 *               escolaridade:
 *                 type: string
 *                 description: Escolaridade
 *               estado:
 *                 type: string
 *                 description: Estado (UF)
 *               faz_tratamento_psicologico:
 *                 type: boolean
 *                 description: Faz tratamento psicológico
 *               tratamentos:
 *                 type: string
 *                 description: Tratamentos psicológicos
 *               toma_medicacao_psiquiatrica:
 *                 type: boolean
 *                 description: Toma medicação psiquiátrica
 *               medicacoes:
 *                 type: string
 *                 description: Medicações
 *           examples:
 *             atualizarIdade:
 *               summary: Atualizar apenas a idade
 *               value:
 *                 idade: 27
 *             atualizarNome:
 *               summary: Atualizar apenas as iniciais
 *               value:
 *                 iniciais_do_nome: "ABC"
 *             atualizarDadosSocio:
 *               summary: Atualizar dados sociodemográficos
 *               value:
 *                 email: "joao@example.com"
 *                 estado: "SP"
 *             atualizarCompleto:
 *               summary: Atualizar múltiplos campos
 *               value:
 *                 iniciais_do_nome: "ABC"
 *                 idade: 27
 *                 sexo: "M"
 *                 email: "abc@example.com"
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


