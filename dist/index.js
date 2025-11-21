"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const swagger_1 = require("./config/swagger");
const prisma_middleware_1 = require("./middleware/prisma.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const questionarios_1 = __importDefault(require("./routes/questionarios"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const respostas_1 = __importDefault(require("./routes/respostas"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const app = (0, express_1.default)();
// Middlewares globais
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true,
}));
app.use((0, compression_1.default)({
    level: 6,
    threshold: 1024
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Middleware do Prisma
app.use(prisma_middleware_1.prismaMiddleware);
// Swagger Documentation
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Neuroscan API Docs"
}));
// Swagger JSON
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swagger_1.swaggerSpec);
});
// Health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "API funcionando corretamente",
        timestamp: new Date().toISOString(),
        environment: env_1.env.NODE_ENV,
    });
});
// Rotas da API
app.use("/api/questionarios", questionarios_1.default);
app.use("/api/usuarios", usuarios_1.default);
app.use("/api/respostas", respostas_1.default);
app.use("/api/dashboard", dashboard_1.default);
// Tratamento de rotas não encontradas
app.use(error_middleware_1.notFoundHandler);
// Error handler (deve ser o último middleware)
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(env_1.env.PORT, "0.0.0.0", () => {
            console.log(`✅ Servidor rodando na porta ${env_1.env.PORT}`);
            console.log(`🌍 Ambiente: ${env_1.env.NODE_ENV}`);
        });
    }
    catch (error) {
        console.error("❌ Erro ao iniciar servidor:", error);
        process.exit(1);
    }
};
// Graceful shutdown
const shutdown = async (signal) => {
    console.log(`\n🚦 ${signal} recebido. Encerrando servidor...`);
    await (0, database_1.disconnectDatabase)();
    process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map