import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Neuroscan API",
      version: "1.0.0",
      description: "API RESTful para coleta e análise de dados de sensores móveis (acelerômetro e giroscópio) durante testes cognitivos.",
      contact: {
        name: "Neuroscan Team",
        email: "contato@neuroscan.com"
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" 
          ? "https://neuroscan-app.onrender.com"
          : "http://localhost:3001",
        description: process.env.NODE_ENV === "production" ? "Servidor de Produção" : "Servidor de Desenvolvimento"
      }
    ],
    tags: [
      {
        name: "Health",
        description: "Endpoints de status da API"
      },
      {
        name: "Usuários",
        description: "Gerenciamento de usuários"
      },
      {
        name: "Respostas",
        description: "Coleta de dados de sensores e respostas"
      },
      {
        name: "Questionários",
        description: "Gerenciamento de questionários"
      },
      {
        name: "Dashboard",
        description: "Estatísticas e visualizações"
      },
      {
        name: "Dados Sociodemográficos",
        description: "Gerenciamento de dados sociodemográficos dos usuários"
      }
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Mensagem de erro"
            },
            details: {
              type: "object",
              description: "Detalhes adicionais (apenas em desenvolvimento)"
            }
          }
        },
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único do usuário"
            },
            iniciais_do_nome: {
              type: "string",
              description: "Iniciais do nome (2-10 caracteres)",
              example: "JDS"
            },
            idade: {
              type: "integer",
              description: "Idade do usuário",
              example: 25
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Data de criação"
            }
          }
        },
        Questionario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único do questionário"
            },
            nome: {
              type: "string",
              description: "Nome do questionário",
              example: "Questionário de Perfil"
            },
            perguntas: {
              type: "array",
              description: "Lista de perguntas do questionário",
              items: {
                $ref: "#/components/schemas/Pergunta"
              }
            }
          }
        },
        Pergunta: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID único da pergunta"
            },
            numero: {
              type: "integer",
              description: "Número da pergunta no questionário",
              example: 1
            },
            texto: {
              type: "string",
              description: "Texto da pergunta",
              example: "Qual é a sua idade?"
            },
            questionario_id: {
              type: "integer",
              description: "ID do questionário ao qual pertence"
            }
          }
        },
        SensorDataCompact: {
          type: "object",
          required: ["usuario_id", "pergunta_id", "resposta", "duracao", "idle", "quantidade_cliques", "quantidade_passos", "timestamp_inicial", "sensores"],
          properties: {
            usuario_id: {
              type: "integer",
              description: "ID do usuário",
              example: 1
            },
            pergunta_id: {
              type: "integer",
              description: "ID da pergunta",
              example: 1
            },
            resposta: {
              type: "integer",
              description: "Resposta escolhida",
              example: 2
            },
            duracao: {
              type: "number",
              description: "Duração total em segundos",
              example: 0
            },
            idle: {
              type: "number",
              description: "Tempo de inatividade em segundos",
              example: 3.04
            },
            quantidade_cliques: {
              type: "integer",
              description: "Número de toques na tela",
              example: 7
            },
            quantidade_passos: {
              type: "integer",
              description: "Passos detectados",
              example: 0
            },
            timestamp_inicial: {
              type: "integer",
              format: "int64",
              description: "Timestamp Unix em milissegundos do início",
              example: 1763600253084
            },
            frequencia_hz: {
              type: "number",
              description: "Frequência de amostragem (opcional)",
              example: 10.12
            },
            sensores: {
              type: "array",
              description: "Array de leituras dos sensores",
              items: {
                type: "array",
                items: {
                  type: "number"
                },
                minItems: 7,
                maxItems: 7,
                description: "[offset_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z]",
                example: [101, 10.13, 8.72, 10.06, 0.11, 0.23, 0.14]
              }
            }
          }
        },
        RespostaResponse: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID da resposta criada"
            },
            message: {
              type: "string",
              example: "Resposta criada com sucesso"
            },
            sensores_processados: {
              type: "integer",
              description: "Quantidade de sensores processados",
              example: 83
            },
            formato: {
              type: "string",
              example: "compacto-gzip"
            },
            tempo_processamento_ms: {
              type: "integer",
              description: "Tempo de processamento em milissegundos",
              example: 1697
            },
            reducao_tamanho: {
              type: "string",
              example: "~86%"
            },
            compressao_http: {
              type: "string",
              example: "gzip (level 6)"
            }
          }
        }
      }
    }
  },
  apis: [
    "./src/routes/respostas.ts",
    "./src/routes/usuarios.ts",
    "./src/routes/questionarios.ts",
    "./src/routes/dashboard.ts"
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
