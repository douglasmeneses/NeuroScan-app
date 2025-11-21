"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Iniciando seed do banco de dados...");
    // Criar questionários
    const questionario1 = await prisma.questionario.create({
        data: {
            nome: "Questionário de Bem-estar",
            quantidade_questoes: 15,
        },
    });
    const questionario2 = await prisma.questionario.create({
        data: {
            nome: "Questionário de Produtividade",
            quantidade_questoes: 12,
        },
    });
    const questionario3 = await prisma.questionario.create({
        data: {
            nome: "Questionário de Satisfação",
            quantidade_questoes: 15,
        },
    });
    // Criar perguntas para questionário 1
    const perguntasQ1 = [];
    for (let i = 1; i <= 15; i++) {
        const pergunta = await prisma.pergunta.create({
            data: {
                numero: i,
                questionario_id: questionario1.id,
                texto: `Pergunta ${i} do questionário de bem-estar: Como você se sente hoje?`,
            },
        });
        perguntasQ1.push(pergunta);
    }
    // Criar perguntas para questionário 2
    const perguntasQ2 = [];
    for (let i = 1; i <= 12; i++) {
        const pergunta = await prisma.pergunta.create({
            data: {
                numero: i,
                questionario_id: questionario2.id,
                texto: `Pergunta ${i} do questionário de produtividade: Qual seu nível de concentração?`,
            },
        });
        perguntasQ2.push(pergunta);
    }
    // Criar perguntas para questionário 3
    const perguntasQ3 = [];
    for (let i = 1; i <= 15; i++) {
        const pergunta = await prisma.pergunta.create({
            data: {
                numero: i,
                questionario_id: questionario3.id,
                texto: `Pergunta ${i} do questionário de satisfação: Como avalia nosso serviço?`,
            },
        });
        perguntasQ3.push(pergunta);
    }
    // Criar usuários
    const usuarios = [];
    const nomes = ["AB", "CD", "EF", "GH", "IJ"];
    const idades = [25, 30, 35, 28, 32];
    for (let i = 0; i < 5; i++) {
        const usuario = await prisma.usuario.create({
            data: {
                iniciais_do_nome: nomes[i],
                idade: idades[i],
            },
        });
        usuarios.push(usuario);
    }
    // Criar respostas com dados simulados
    //   const todasPerguntas = [...perguntasQ1, ...perguntasQ2, ...perguntasQ3];
    //   for (const usuario of usuarios) {
    //     for (const pergunta of todasPerguntas) {
    //       const agora = new Date();
    //       const inicioResposta = new Date(agora.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Últimos 7 dias
    //       const duracao = Math.floor(Math.random() * 30000) + 5000; // 5-35 segundos
    //       const idle = Math.floor(Math.random() * 3000) + 500; // 0.5-3.5 segundos
    //       const cliques = Math.floor(Math.random() * 3) + 1; // 1-3 cliques (valores baixos)
    //       const passos = Math.floor(Math.random() * 2); // 0-1 passos (valores muito baixos)
    //       const resposta = await prisma.resposta.create({
    //         data: {
    //           pergunta_id: pergunta.id,
    //           usuario_id: usuario.id,
    //           resposta: `Resposta do usuário ${usuario.iniciais_do_nome} para pergunta ${pergunta.numero}`,
    //           duracao,
    //           idle,
    //           quantidade_cliques: cliques,
    //           quantidade_passos: passos,
    //           dh_inicio: new Date(inicioResposta.toISOString()),
    //           dh_fim: new Date(new Date(inicioResposta.getTime() + duracao).toISOString()),
    //         },
    //       });
    //       // Criar coletas de dados dos sensores (a cada 100ms durante a resposta)
    //       const numeroColetas = Math.floor(duracao / 100); // Uma coleta a cada 100ms
    //       for (let i = 0; i < numeroColetas; i++) {
    //         const timestampColeta = new Date(inicioResposta.getTime() + (i * 100));
    //         const coleta = await prisma.coleta.create({
    //           data: {
    //             resposta_id: resposta.id,
    //             timestamp: timestampColeta,
    //           },
    //         });
    //         // Dados do acelerômetro (simulados)
    //         await prisma.acelerometro.create({
    //           data: {
    //             coleta_id: coleta.id,
    //             eixo_x: (Math.random() - 0.5) * 2, // -1 a 1
    //             eixo_y: (Math.random() - 0.5) * 2, // -1 a 1
    //             eixo_z: Math.random() * 0.5 + 9.5, // 9.5 a 10 (gravidade)
    //           },
    //         });
    //         // Dados do giroscópio (simulados)
    //         await prisma.giroscopio.create({
    //           data: {
    //             coleta_id: coleta.id,
    //             eixo_x: (Math.random() - 0.5) * 0.2, // -0.1 a 0.1
    //             eixo_y: (Math.random() - 0.5) * 0.2, // -0.1 a 0.1
    //             eixo_z: (Math.random() - 0.5) * 0.2, // -0.1 a 0.1
    //           },
    //         });
    //       }
    //     }
    //   }
    // Exemplo de criação de resposta com datas ISO
    await prisma.resposta.create({
        data: {
            usuario_id: 1,
            pergunta_id: 1,
            resposta: "Exemplo de resposta",
            duracao: 1000,
            idle: 200,
            quantidade_cliques: 3,
            quantidade_passos: 10,
            dh_inicio: new Date("2025-06-10T21:56:08.000Z"), // Use Date object
            dh_fim: new Date("2025-06-10T21:56:13.000Z"), // Use Date object
        },
    });
    console.log("Seed concluído com sucesso!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map