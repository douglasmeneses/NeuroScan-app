import { Router } from "express";
import {
  listarGonogos,
  buscarGonogosPorUsuario,
  buscarGonogoPorId,
  criarGonogo,
  atualizarGonogo,
  deletarGonogo,
} from "../controllers/gonogoController";

const router = Router();

/**
 * @openapi
 * /api/gonogos:
 *   get:
 *     tags:
 *       - GoNogo
 *     summary: Listar todos os registros GoNogo
 *     description: Retorna todos os registros de testes GoNogo com informações do usuário
 *     responses:
 *       200:
 *         description: Lista de registros GoNogo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GoNogo'
 */
router.get("/", listarGonogos);

/**
 * @openapi
 * /api/gonogos/usuario/{usuario_id}:
 *   get:
 *     tags:
 *       - GoNogo
 *     summary: Buscar registros GoNogo por usuário
 *     description: Retorna todos os registros de testes GoNogo de um usuário específico
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de registros GoNogo do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GoNogo'
 */
router.get("/usuario/:usuario_id", buscarGonogosPorUsuario);

/**
 * @openapi
 * /api/gonogos/{id}:
 *   get:
 *     tags:
 *       - GoNogo
 *     summary: Buscar registro GoNogo por ID
 *     description: Retorna um registro específico de teste GoNogo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do registro GoNogo
 *     responses:
 *       200:
 *         description: Registro GoNogo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoNogo'
 *       404:
 *         description: Registro não encontrado
 */
router.get("/:id", buscarGonogoPorId);

/**
 * @openapi
 * /api/gonogos:
 *   post:
 *     tags:
 *       - GoNogo
 *     summary: Criar novo registro GoNogo
 *     description: |
 *       Cria um novo registro de teste GoNogo com as métricas de desempenho
 *
 *       **Métricas do teste:**
 *       - **Erros de Comissão (%)**: Percentual de respostas incorretas em estímulos No-Go
 *       - **Erros de Omissão (%)**: Percentual de falta de resposta em estímulos Go
 *       - **Acerto em Go (%)**: Percentual de acertos em estímulos Go
 *       - **Tempo Médio de Reação (ms)**: Tempo médio de resposta
 *       - **Variabilidade do RT (ms)**: Variabilidade do tempo de reação
 *       - **Latência Média em No-Go (erro)**: Latência média nos erros de No-Go
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - erros_comissao_percentual
 *               - erros_omissao_percentual
 *               - acerto_go_percentual
 *               - tempo_medio_reacao_ms
 *               - variabilidade_rt_ms
 *               - latencia_media_nogo_erro
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário
 *                 example: 1
 *               erros_comissao_percentual:
 *                 type: number
 *                 format: float
 *                 description: Percentual de erros de comissão
 *                 example: 12.5
 *               erros_omissao_percentual:
 *                 type: number
 *                 format: float
 *                 description: Percentual de erros de omissão
 *                 example: 8.3
 *               acerto_go_percentual:
 *                 type: number
 *                 format: float
 *                 description: Percentual de acertos em Go
 *                 example: 91.7
 *               tempo_medio_reacao_ms:
 *                 type: number
 *                 format: float
 *                 description: Tempo médio de reação em milissegundos
 *                 example: 450.25
 *               variabilidade_rt_ms:
 *                 type: number
 *                 format: float
 *                 description: Variabilidade do tempo de reação
 *                 example: 125.8
 *               latencia_media_nogo_erro:
 *                 type: number
 *                 format: float
 *                 description: Latência média em erros de No-Go
 *                 example: 320.5
 *     responses:
 *       201:
 *         description: Registro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoNogo'
 *       400:
 *         description: Dados inválidos
 */
router.post("/", criarGonogo);

/**
 * @openapi
 * /api/gonogos/{id}:
 *   put:
 *     tags:
 *       - GoNogo
 *     summary: Atualizar registro GoNogo
 *     description: Atualiza as métricas de um registro GoNogo existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do registro GoNogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               erros_comissao_percentual:
 *                 type: number
 *                 format: float
 *               erros_omissao_percentual:
 *                 type: number
 *                 format: float
 *               acerto_go_percentual:
 *                 type: number
 *                 format: float
 *               tempo_medio_reacao_ms:
 *                 type: number
 *                 format: float
 *               variabilidade_rt_ms:
 *                 type: number
 *                 format: float
 *               latencia_media_nogo_erro:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Registro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GoNogo'
 *       404:
 *         description: Registro não encontrado
 */
router.put("/:id", atualizarGonogo);

/**
 * @openapi
 * /api/gonogos/{id}:
 *   delete:
 *     tags:
 *       - GoNogo
 *     summary: Deletar registro GoNogo
 *     description: Remove um registro GoNogo do banco de dados
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do registro GoNogo
 *     responses:
 *       204:
 *         description: Registro deletado com sucesso
 *       404:
 *         description: Registro não encontrado
 */
router.delete("/:id", deletarGonogo);

/**
 * @openapi
 * components:
 *   schemas:
 *     GoNogo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do registro
 *           example: 1
 *         usuario_id:
 *           type: integer
 *           description: ID do usuário
 *           example: 1
 *         erros_comissao_percentual:
 *           type: number
 *           format: float
 *           description: Erros de Comissão (%)
 *           example: 12.5
 *         erros_omissao_percentual:
 *           type: number
 *           format: float
 *           description: Erros de Omissão (%)
 *           example: 8.3
 *         acerto_go_percentual:
 *           type: number
 *           format: float
 *           description: Acerto em Go (%)
 *           example: 91.7
 *         tempo_medio_reacao_ms:
 *           type: number
 *           format: float
 *           description: Tempo Médio de Reação (ms)
 *           example: 450.25
 *         variabilidade_rt_ms:
 *           type: number
 *           format: float
 *           description: Variabilidade do RT (ms)
 *           example: 125.8
 *         latencia_media_nogo_erro:
 *           type: number
 *           format: float
 *           description: Latência Média em No-Go (erro)
 *           example: 320.5
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 *         usuario:
 *           type: object
 *           description: Informações do usuário
 */

export default router;
