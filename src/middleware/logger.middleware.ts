import { Request, Response, NextFunction } from "express";

/**
 * Middleware de logging para todas as requisições HTTP
 * Registra informações detalhadas em todos os ambientes (dev e prod)
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();

  // Captura informações da requisição
  const requestInfo = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get("user-agent"),
    contentType: req.get("content-type"),
    contentLength: req.get("content-length"),
  };

  // Log da requisição recebida
  console.log(
    `📥 [${requestInfo.timestamp}] ${requestInfo.method} ${requestInfo.path} | IP: ${requestInfo.ip}`
  );

  // Captura a resposta quando finalizar
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusEmoji = res.statusCode >= 400 ? "❌" : "✅";

    console.log(
      `${statusEmoji} [${new Date().toISOString()}] ${requestInfo.method} ${
        requestInfo.path
      } | Status: ${res.statusCode} | Tempo: ${duration}ms | IP: ${
        requestInfo.ip
      }`
    );

    // Log adicional para erros
    if (res.statusCode >= 400) {
      console.error(
        `⚠️  Erro na requisição: ${requestInfo.method} ${requestInfo.path} | Status: ${res.statusCode} | UserAgent: ${requestInfo.userAgent}`
      );
    }

    // Log detalhado para uploads e grandes payloads
    if (requestInfo.contentLength) {
      const sizeKB = (parseInt(requestInfo.contentLength) / 1024).toFixed(2);
      console.log(
        `📊 Payload recebido: ${sizeKB}KB | ContentType: ${requestInfo.contentType} | Tempo: ${duration}ms`
      );
    }
  });

  next();
};
