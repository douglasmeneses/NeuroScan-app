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
- **CORS** - Configuração de Cross-Origin Resource Sharing

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (use `.env.example` como referência):

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/neuroscan
CORS_ORIGIN=http://localhost:3001
```

### CORS (Cross-Origin Resource Sharing)

A API suporta configuração flexível de CORS:

**Desenvolvimento (permitir todas as origens):**
```env
CORS_ORIGIN=*
```

**Produção (origens específicas):**
```env
CORS_ORIGIN=http://localhost:3001,https://dashboard.exemplo.com
```

Veja [CORS.md](./CORS.md) para mais detalhes.

## 📈 Performance

### Benchmark (83 sensores, dados reais):

| Métrica | Valor |
|---------|-------|
| **Tamanho na rede** | 1926 bytes (~1.9 KB) |
| **Tempo de processamento** | ~1697ms |
| **Redução vs JSON tradicional** | 86% |
| **Throughput** | ~49 sensores/segundo |

Para documentação completa, acesse: **http://localhost:3001/api-docs**
