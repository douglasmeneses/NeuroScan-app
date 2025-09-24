import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Importar rotas
import questionarioRoutes from "./routes/questionarios";
import usuarioRoutes from "./routes/usuarios";
import respostaRoutes from "./routes/respostas";
import dashboardRoutes from "./routes/dashboard";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || "3001", 10);
// Evita múltiplas instâncias do PrismaClient em ambiente de desenvolvimento com Nodemon
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// Middleware para disponibilizar o Prisma nas rotas
app.use((req, res, next) => {
  (req as any).prisma = prisma;
  next();
});

// Rotas
app.use("/api/questionarios", questionarioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/respostas", respostaRoutes);
app.use("/api/dashboard", dashboardRoutes);

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

export default app;
