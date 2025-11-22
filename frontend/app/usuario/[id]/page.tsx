'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, User, Clock, MousePointer, Footprints } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { getUsuariosStats, getGraficosRespostas, UsuarioStats, GraficosRespostas } from "@/lib/api";
import { formatDuration, formatNumber, formatDate } from "@/lib/format";

const clicksChartConfig = {
  valor: {
    label: "Cliques",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const stepsChartConfig = {
  valor: {
    label: "Passos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const durationChartConfig = {
  valor: {
    label: "Duração (s)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function UsuarioPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);

  const [usuario, setUsuario] = useState<UsuarioStats | null>(null);
  const [graficosData, setGraficosData] = useState<GraficosRespostas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [usuariosData, graficosRespostas] = await Promise.all([
          getUsuariosStats(),
          getGraficosRespostas(),
        ]);

        const usuarioEncontrado = usuariosData.find(u => u.id === userId);
        if (!usuarioEncontrado) {
          setError("Usuário não encontrado");
          return;
        }

        setUsuario(usuarioEncontrado);
        setGraficosData(graficosRespostas);
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Erro</h1>
          <p className="text-muted-foreground mb-4">{error || "Usuário não encontrado"}</p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Filtrar dados do usuário
  const usuarioCliques = graficosData?.cliques.filter(d => d.usuario === usuario.iniciais_do_nome) || [];
  const usuarioPassos = graficosData?.passos.filter(d => d.usuario === usuario.iniciais_do_nome) || [];
  const usuarioDuracao = graficosData?.duracao.filter(d => d.usuario === usuario.iniciais_do_nome).map(d => ({
    ...d,
    valor: d.valor / 1000 // converter para segundos
  })) || [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </button>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-lg px-3 py-1">
              {usuario.iniciais_do_nome}
            </Badge>
            <div>
              <h1 className="text-3xl font-bold">Detalhes do Usuário</h1>
              <p className="text-muted-foreground">
                Análise detalhada das interações
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cliques</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(usuario.total_cliques)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Passos</CardTitle>
              <Footprints className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(usuario.total_passos)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(usuario.tempo_total)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(usuario.tempo_medio_por_resposta)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos de Linha */}
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Cliques</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={clicksChartConfig} className="h-[300px] w-full">
                <LineChart data={usuarioCliques} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pergunta" 
                    label={{ value: 'Pergunta', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Passos</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={stepsChartConfig} className="h-[300px] w-full">
                <LineChart data={usuarioPassos} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pergunta" 
                    label={{ value: 'Pergunta', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Tempo (s)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={durationChartConfig} className="h-[300px] w-full">
                <LineChart data={usuarioDuracao} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="pergunta" 
                    label={{ value: 'Pergunta', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Respostas Detalhadas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Questionário</TableHead>
                    <TableHead className="text-center">Pergunta</TableHead>
                    <TableHead className="text-center">Cliques</TableHead>
                    <TableHead className="text-center">Passos</TableHead>
                    <TableHead className="text-center">Duração</TableHead>
                    <TableHead className="text-center">Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarioCliques.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.questionario}</TableCell>
                      <TableCell className="text-center">#{item.pergunta}</TableCell>
                      <TableCell className="text-center">{item.valor}</TableCell>
                      <TableCell className="text-center">{usuarioPassos[index]?.valor || 0}</TableCell>
                      <TableCell className="text-center">{formatDuration(graficosData?.duracao[index]?.valor || 0)}</TableCell>
                      <TableCell className="text-center">{formatDate(item.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
