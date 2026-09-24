# 🧠 NeuroScan App — Plataforma de Avaliação Neuropsicológica e Telemetria

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15%2B-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Plataforma full-stack integrada para aplicação de questionários clínicos, testes cognitivos de controle inibitório (**Go/No-Go**) e coleta contínua de telemetria comportamental e de sensores inerciais (Acelerômetro e Giroscópio) durante o preenchimento de avaliações neuropsicológicas.

---

## 📌 Funcionalidades

- 📝 **Questionários Neuropsicológicos:** Gestão dinâmica de questionários clínicos e baterias de perguntas estruturadas.
- ⏱️ **Telemetria Comportamental:** Registro preciso de latência de resposta, tempo ocioso (*idle time* até o primeiro clique), total de cliques e navegação.
- 📱 **Captura de Sensores Físicos:** Coleta temporal de eixos tridimensionais (X, Y, Z) de **Acelerômetro** e **Giroscópio** para análise biométrica e psicomotora.
- 🎯 **Bateria Go/No-Go:** Processamento automatizado de métricas de controle inibitório:
  - Erros de comissão e omissão
  - Percentual de acerto Go
  - Tempo médio de reação (RT em ms)
  - Variabilidade do tempo de reação e latência de erro No-Go
- 📊 **Interface Reativa:** Dashboard de visualização construído em Next.js com componentes Shadcn UI.
- 📖 **API REST Documentada:** Backend Express estruturado com Prisma ORM e documentação Swagger integrada.

---

## 🏗️ Estrutura do Repositório

```text
NeuroScan-app/
├── api/                    # Backend RESTful (Express, Prisma, PostgreSQL)
│   ├── prisma/             # Schema relacional (Questionario, Pergunta, Resposta, Coletas, GoNogo)
│   ├── src/                # Controladores, rotas, middlewares e serviços
│   ├── swagger/            # Documentação interativa da API
│   └── package.json
├── frontend/               # Interface Web (Next.js 15, React 19, Tailwind)
│   ├── app/                # Rotas e páginas (App Router)
│   ├── components/         # Componentes visuais e formulários
│   └── package.json
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

### Backend (`/api`)
- **Runtime:** Node.js & TypeScript
- **Servidor:** Express.js 5.x
- **ORM:** Prisma 6.x
- **Banco de Dados:** PostgreSQL
- **Documentação:** Swagger UI (`swagger-ui-express` & `swagger-jsdoc`)
- **Validação:** Zod

### Frontend (`/frontend`)
- **Framework:** Next.js (React 19)
- **Estilização:** Tailwind CSS & Shadcn UI
- **Tipagem:** TypeScript

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (v20 ou superior)
- Instância do [PostgreSQL](https://www.postgresql.org/) ativa

---

### 1. Clonar o repositório
```bash
git clone https://github.com/douglasmeneses/NeuroScan-app.git
cd NeuroScan-app
```

### 2. Configurar e rodar o Backend (`/api`)
```bash
cd api
npm install

# Copie e configure o arquivo de variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco
npm run db:push

# Inicie o servidor
npm run dev
```
A API estará disponível em `http://localhost:3000` (ou na porta definida no `.env`) com documentação Swagger em `/api-docs`.

---

### 3. Configurar e rodar o Frontend (`/frontend`)
```bash
cd ../frontend
npm install
npm run dev
```
Acesse a aplicação em `http://localhost:3001` (ou `3000`).

---

## 👨‍💻 Autor

Desenvolvido por **Douglas Meneses**.

- 💼 GitHub: [@douglasmeneses](https://github.com/douglasmeneses)
- ✉️ Email: [meneses.doug@gmail.com](mailto:meneses.doug@gmail.com)
