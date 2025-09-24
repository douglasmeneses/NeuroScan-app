"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
// Importar rotas
const questionarios_1 = __importDefault(require("./routes/questionarios"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const respostas_1 = __importDefault(require("./routes/respostas"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT || "3001", 10);
const prisma = global.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production")
    global.prisma = prisma;
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(express_1.default.json());
// Middleware para disponibilizar o Prisma nas rotas
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});
// Rotas
app.use("/api/questionarios", questionarios_1.default);
app.use("/api/usuarios", usuarios_1.default);
app.use("/api/respostas", respostas_1.default);
app.use("/api/dashboard", dashboard_1.default);
// Rota de teste
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "API funcionando corretamente" });
});
// Iniciar servidor
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});
// Graceful shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map