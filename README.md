# Backend - Neuroscan API

API RESTful construída com **Express.js**, **TypeScript**, **Prisma ORM** e **PostgreSQL** (Supabase).

## 📚 Documentação API (Swagger)

A documentação interativa da API está disponível em:

```
http://localhost:3001/api-docs
```

**Recursos do Swagger:**
- ✅ Documentação completa de todos os endpoints
- ✅ Schemas detalhados (request/response)
- ✅ Exemplos práticos de uso
- ✅ Interface para testar endpoints diretamente
- ✅ Download da especificação OpenAPI 3.0

**Endpoints de documentação:**
- `GET /api-docs` - Interface Swagger UI
- `GET /api-docs.json` - Especificação OpenAPI JSON

## 🚀 Acesso Rápido

```bash
# Iniciar servidor
npm run dev

# Acessar documentação
open http://localhost:3001/api-docs
```

## 🛠️ Tecnologias

- **Express.js 5** - Framework web
- **TypeScript 5** - Type safety
- **Prisma 7** - ORM
- **Zod 4** - Validação de schemas
- **PostgreSQL** - Banco de dados (Supabase)
- **Swagger/OpenAPI 3.0** - Documentação interativa
- **Compression** - Middleware gzip para HTTP

## 📈 Performance

### Benchmark (83 sensores, dados reais):

| Métrica | Valor |
|---------|-------|
| **Tamanho na rede** | 1926 bytes (~1.9 KB) |
| **Tempo de processamento** | ~1697ms |
| **Redução vs JSON tradicional** | 86% |
| **Throughput** | ~49 sensores/segundo |

Para documentação completa, acesse: **http://localhost:3001/api-docs**
