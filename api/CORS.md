# Configuração de CORS

## Como configurar

1. Crie um arquivo `.env` na raiz do projeto API (copie do `.env.example`)
2. Configure a variável `CORS_ORIGIN` conforme necessário:

### Desenvolvimento (permite todas as origens)
```env
CORS_ORIGIN=*
```

### Desenvolvimento (origem específica)
```env
CORS_ORIGIN=http://localhost:3001
```

### Produção (múltiplas origens)
```env
CORS_ORIGIN=https://dashboard.exemplo.com,https://app.exemplo.com
```

## Métodos HTTP permitidos
- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

## Headers permitidos
- Content-Type
- Authorization

## Observações
- A API aceita requisições sem origem (útil para apps mobile ou curl)
- Credenciais (cookies) são permitidas quando `credentials: true`
- Para adicionar mais origens, separe com vírgula no `.env`
