import { Router } from "express";
import {
  listarRespostas,
  criarRespostaDeJsonCompactoComGzip,
  criarRespostaDeJsonDireto,
  buscarRespostaPorId,
  buscarSensoresPorResposta,
} from "../controllers/respostaController";


const router = Router();

/**
 * @openapi
 * /api/respostas/json:
 *   post:
 *     tags:
 *       - Respostas
 *     summary: Criar resposta com JSON direto (sem compressão)
 *     description: |
 *       Cria uma nova resposta enviando JSON compacto diretamente no body da requisição.
 *       
 *       **Diferença entre endpoints:**
 *       - `/api/respostas/json`: Aceita JSON direto no body (este endpoint)
 *       - `/api/respostas`: Aceita arquivo .gz comprimido via multipart/form-data
 *       
 *       **Formato Compacto:**
 *       - Redução de ~86% no tamanho vs JSON tradicional
 *       - Arrays para máxima eficiência
 *       - Compressão HTTP gzip automática (level 6)
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
 *             duracao: 8302
 *             idle: 3.04
 *             quantidade_cliques: 7
 *             quantidade_passos: 0
 *             timestamp_inicial: 1763600253084
 *             frequencia_hz: 10
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da resposta criada
 *                 message:
 *                   type: string
 *                   example: "Resposta criada com sucesso"
 *                 sensores_processados:
 *                   type: integer
 *                   description: Quantidade de sensores processados
 *                 formato:
 *                   type: string
 *                   example: "compacto-json"
 *                 tempo_processamento_ms:
 *                   type: integer
 *                   description: Tempo de processamento em milissegundos
 *                 reducao_tamanho:
 *                   type: string
 *                   example: "~86%"
 *                 compressao_http:
 *                   type: string
 *                   example: "none"
 *             example:
 *               id: 5
 *               message: "Resposta criada com sucesso"
 *               sensores_processados: 83
 *               formato: "compacto-json"
 *               tempo_processamento_ms: 2435
 *               reducao_tamanho: "~86%"
 *               compressao_http: "none"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/json", criarRespostaDeJsonDireto);

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
router.get("/", listarRespostas);

/**
 * @openapi
 * /api/respostas:
 *   post:
 *     tags:
 *       - Respostas
 *     summary: Criar resposta com arquivo .gz comprimido
 *     description: |
 *       Cria uma nova resposta enviando arquivo .gz via upload multipart/form-data.
 *       O arquivo .gz deve conter JSON no formato compacto.
 *       
 *       **Diferença entre endpoints:**
 *       - `/api/respostas`: Aceita arquivo .gz comprimido via multipart/form-data (este endpoint)
 *       - `/api/respostas/json`: Aceita JSON direto no body
 *       
 *       **Quando usar:**
 *       - Use este endpoint quando quiser compressão adicional além do HTTP gzip
 *       - Ideal para grandes volumes de dados (centenas/milhares de sensores)
 *       - Redução total: ~86% (formato compacto) + ~70% (gzip) = ~95% vs JSON tradicional
 *       
 *       **Formato Compacto:**
 *       - Arrays para máxima eficiência
 *       - Redução de ~86% no tamanho vs JSON tradicional
 *       
 *       **Array de Sensores:**
 *       Cada elemento tem 7 valores: `[offset_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z]`
 *       - `offset_ms`: Milissegundos desde timestamp_inicial
 *       - `accel_x/y/z`: Acelerômetro em m/s² (eixos X, Y, Z)
 *       - `gyro_x/y/z`: Giroscópio em rad/s (rotação X, Y, Z)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo .gz contendo JSON compacto dos dados de sensores
 *             required:
 *               - file
 *           example:
 *             file: dados_sensores.json.gz
 *     responses:
 *       201:
 *         description: Resposta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da resposta criada
 *                 message:
 *                   type: string
 *                   example: "Resposta criada com sucesso"
 *                 sensores_processados:
 *                   type: integer
 *                   description: Quantidade de sensores processados
 *                 formato:
 *                   type: string
 *                   example: "compacto-gzip"
 *                 tempo_processamento_ms:
 *                   type: integer
 *                   description: Tempo de processamento em milissegundos
 *                 reducao_tamanho:
 *                   type: string
 *                   example: "~86%"
 *                 compressao_http:
 *                   type: string
 *                   example: "gzip (level 6)"
 *             example:
 *               id: 4
 *               message: "Resposta criada com sucesso"
 *               sensores_processados: 83
 *               formato: "compacto-gzip"
 *               tempo_processamento_ms: 1892
 *               reducao_tamanho: "~86%"
 *               compressao_http: "gzip (level 6)"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", criarRespostaDeJsonCompactoComGzip);

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
router.get("/:id", buscarRespostaPorId);

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
router.get("/:id/sensores", buscarSensoresPorResposta);

export default router;
