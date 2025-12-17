import express from "express";
import cors from "cors";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import { prismaMiddleware } from "./middleware/prisma.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";

import questionarioRoutes from "./routes/questionarios";
import usuarioRoutes from "./routes/usuarios";
import respostaRoutes from "./routes/respostas";
import dashboardRoutes from "./routes/dashboard";
import gonogoRoutes from "./routes/gonogos";

const app = express();

// Parse CORS_ORIGIN to support multiple origins
const allowedOrigins =
  env.CORS_ORIGIN === "*"
    ? "*"
    : env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

// Middlewares globais
app.use(
  cors({
    origin:
      allowedOrigins === "*"
        ? "*"
        : (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);

            if (
              Array.isArray(allowedOrigins) &&
              allowedOrigins.includes(origin)
            ) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  compression({
    level: 6,
    threshold: 1024,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging para todas as requisições
app.use(requestLogger);

// Middleware do Prisma
app.use(prismaMiddleware);

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Neuroscan API Docs",
  })
);

// Swagger JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API funcionando corretamente",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// Rotas da API
app.use("/api/questionarios", questionarioRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/respostas", respostaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/gonogo", gonogoRoutes);

// Tratamento de rotas não encontradas
app.use(notFoundHandler);

// Error handler (deve ser o último middleware)
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.PORT, "0.0.0.0", () => {
      console.log(`✅ Servidor rodando na porta ${env.PORT}`);
      console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n🚦 ${signal} recebido. Encerrando servidor...`);
  await disconnectDatabase();
  process.exit(0);
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();

export default app;
