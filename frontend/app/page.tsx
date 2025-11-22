'use client';

import { useEffect, useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ClicksChart } from "@/components/dashboard/clicks-chart";
import { StepsChart } from "@/components/dashboard/steps-chart";
import { DurationChart } from "@/components/dashboard/duration-chart";
import { UsersTable } from "@/components/dashboard/users-table";
import { QuestionsTable } from "@/components/dashboard/questions-table";
import {
  getStats,
  getTempoQuestionarios,
  getUsuariosStats,
  getGraficosRespostas,
  DashboardStats,
  TempoQuestionario,
  UsuarioStats,
  GraficosRespostas,
} from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tempoQuestionarios, setTempoQuestionarios] = useState<TempoQuestionario[]>([]);
  const [usuariosStats, setUsuariosStats] = useState<UsuarioStats[]>([]);
  const [graficosRespostas, setGraficosRespostas] = useState<GraficosRespostas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [statsData, tempoData, usuariosData, graficosData] = await Promise.all([
          getStats(),
          getTempoQuestionarios(),
          getUsuariosStats(),
          getGraficosRespostas(),
        ]);

        setStats(statsData);
        setTempoQuestionarios(tempoData);
        setUsuariosStats(usuariosData);
        setGraficosRespostas(graficosData);
      } catch (err) {
        setError("Erro ao carregar dados do dashboard. Verifique se a API está rodando.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Erro</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Dashboard Neuroscan</h1>
          <p className="text-muted-foreground">
            Acompanhamento de dados dos questionários
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-1">
          <StatsCard
            title="Total de Usuários"
            value={stats?.totalUsuarios || 0}
            icon={Users}
            description="Usuários cadastrados no sistema"
          />
        </div>

        {/* Gráficos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {graficosRespostas && (
            <>
              <ClicksChart data={graficosRespostas.cliques} />
              <StepsChart data={graficosRespostas.passos} />
              <DurationChart data={graficosRespostas.duracao} />
            </>
          )}
        </div>

        {/* Tabela de Usuários */}
        <UsersTable data={usuariosStats} />

        {/* Tabela de Perguntas */}
        <QuestionsTable data={tempoQuestionarios} />
      </main>
    </div>
  );
}
