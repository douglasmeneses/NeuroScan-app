# Dashboard Neuroscan

Dashboard para acompanhamento dos dados armazenados no banco de dados da aplicação Neuroscan.

## 🚀 Tecnologias

- **Next.js 16** - Framework React
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework CSS
- **ShadcnUI** - Biblioteca de componentes
- **Recharts** - Biblioteca de gráficos

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- API Backend rodando na porta 3000

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Edite o arquivo .env.local com a URL da API
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🏃 Executar

```bash
# Modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

O dashboard estará disponível em [http://localhost:3001](http://localhost:3001)

## 📊 Funcionalidades

### Cards de Estatísticas
- Total de usuários cadastrados
- Total de questionários disponíveis
- Total de respostas coletadas

### Gráficos
- **Total de Cliques por Usuário**: Visualização agregada dos cliques
- **Total de Passos por Usuário**: Visualização agregada dos passos
- **Tempo Total por Usuário**: Duração total em segundos

### Tabelas
- **Estatísticas de Usuários**: Dados completos de interação por usuário
- **Tempo Médio por Pergunta**: Estatísticas de tempo de resposta

## 🔌 API Endpoints

O dashboard consome os seguintes endpoints da API:

- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/tempo-questionarios` - Tempo médio por pergunta
- `GET /api/dashboard/usuarios-stats` - Estatísticas por usuário
- `GET /api/dashboard/graficos-respostas` - Dados para gráficos

## 📁 Estrutura do Projeto

```
frontend/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página do dashboard
│   └── globals.css         # Estilos globais
├── components/
│   ├── ui/                 # Componentes ShadcnUI
│   └── dashboard/          # Componentes do dashboard
│       ├── stats-card.tsx
│       ├── clicks-chart.tsx
│       ├── steps-chart.tsx
│       ├── duration-chart.tsx
│       ├── users-table.tsx
│       └── questions-table.tsx
├── lib/
│   ├── api.ts              # Funções de API
│   ├── format.ts           # Funções de formatação
│   └── utils.ts            # Utilitários
└── .env.local              # Variáveis de ambiente
```

## 🎨 Customização

### Alterar cores do tema
Edite o arquivo `app/globals.css` para modificar as cores do tema.

### Adicionar novos gráficos
1. Crie um novo componente em `components/dashboard/`
2. Importe e use na página `app/page.tsx`

## 📝 Licença

Este projeto é parte do sistema Neuroscan.
