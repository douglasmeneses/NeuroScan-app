"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const respostaController_1 = require("../controllers/respostaController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/respostas:
 *   get:
 *     tags:
 *       - Respostas
 *     summary: Listar todas as respostas
 *     description: Retorna lista de todas as respostas cadastradas
 *     responses:
 *       200:
 *         description: Lista de respostas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get("/", respostaController_1.listarRespostas);
/**
 * @openapi
 * /api/respostas:
 *   post:
 *     tags:
 *       - Respostas
 *     summary: Criar resposta com dados de sensores
 *     description: |
 *       Cria uma nova resposta com dados compactos de sensores.
 *
 *       **Formato Compacto:**
 *       - Redução de ~86% no tamanho vs JSON tradicional
 *       - Compressão gzip automática (HTTP)
 *       - Arrays para máxima eficiência
 *
 *       **Array de Sensores:**
 *       Cada elemento tem 7 valores: `[offset_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z]`
 *       - `offset_ms`: Milissegundos desde timestamp_inicial
 *       - `accel_x/y/z`: Acelerômetro em m/s² (eixos X, Y, Z)
 *       - `gyro_x/y/z`: Giroscópio em rad/s (rotação X, Y, Z)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorDataCompact'
 *           example:
 *             usuario_id: 1
 *             pergunta_id: 1
 *             resposta: 2
 *             duracao: 0
 *             idle: 3.04
 *             quantidade_cliques: 7
 *             quantidade_passos: 0
 *             timestamp_inicial: 1763600253084
 *             sensores:
 *               - [101, 10.13, 8.72, 10.06, 0.11, 0.23, 0.14]
 *               - [202, 10.98, 10.30, 8.32, 0.00, 0.24, -0.06]
 *               - [303, 9.62, 10.01, 10.14, 0.04, -0.08, -0.08]
 *     responses:
 *       201:
 *         description: Resposta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespostaResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", respostaController_1.criarRespostaDeJsonCompactoComGzip);
/**
 * @openapi
 * /api/respostas/{id}:
 *   get:
 *     tags:
 *       - Respostas
 *     summary: Buscar resposta por ID
 *     description: Retorna uma resposta específica pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da resposta
 *     responses:
 *       200:
 *         description: Resposta encontrada
 *       404:
 *         description: Resposta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", respostaController_1.buscarRespostaPorId);
/**
 * @openapi
 * /api/respostas/{id}/sensores:
 *   get:
 *     tags:
 *       - Respostas
 *     summary: Buscar dados de sensores de uma resposta
 *     description: Retorna todos os dados de acelerômetro e giroscópio de uma resposta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da resposta
 *     responses:
 *       200:
 *         description: Dados dos sensores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coletas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                       acelerometro:
 *                         type: object
 *                         properties:
 *                           eixo_x:
 *                             type: number
 *                           eixo_y:
 *                             type: number
 *                           eixo_z:
 *                             type: number
 *                       giroscopio:
 *                         type: object
 *                         properties:
 *                           eixo_x:
 *                             type: number
 *                           eixo_y:
 *                             type: number
 *                           eixo_z:
 *                             type: number
 *       404:
 *         description: Resposta não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id/sensores", respostaController_1.buscarSensoresPorResposta);
exports.default = router;
//# sourceMappingURL=respostas.js.map