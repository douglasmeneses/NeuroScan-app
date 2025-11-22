const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface DashboardStats {
  totalUsuarios: number;
  totalQuestionarios: number;
  totalRespostas: number;
}

export interface TempoQuestionario {
  pergunta_id: number;
  pergunta_numero: number;
  pergunta_texto: string;
  questionario_nome: string;
  tempo_medio: number;
  tempo_total: number;
  total_respostas: number;
}

export interface UsuarioStats {
  id: number;
  iniciais_do_nome: string;
  idade: number;
  total_respostas: number;
  total_cliques: number;
  total_passos: number;
  tempo_total: number;
  tempo_idle_total: number;
  tempo_medio_por_resposta: number;
}

export interface GraficoResposta {
  id: number;
  usuario: string;
  questionario: string;
  pergunta: number;
  valor: number;
  timestamp: string;
}

export interface GraficosRespostas {
  cliques: GraficoResposta[];
  passos: GraficoResposta[];
  duracao: GraficoResposta[];
}

export async function getStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/stats`);
  if (!response.ok) throw new Error('Erro ao buscar estatísticas');
  return response.json();
}

export async function getTempoQuestionarios(): Promise<TempoQuestionario[]> {
  const response = await fetch(`${API_URL}/dashboard/tempo-questionarios`);
  if (!response.ok) throw new Error('Erro ao buscar tempo dos questionários');
  return response.json();
}

export async function getUsuariosStats(): Promise<UsuarioStats[]> {
  const response = await fetch(`${API_URL}/dashboard/usuarios-stats`);
  if (!response.ok) throw new Error('Erro ao buscar estatísticas de usuários');
  return response.json();
}

export async function getGraficosRespostas(): Promise<GraficosRespostas> {
  const response = await fetch(`${API_URL}/dashboard/graficos-respostas`);
  if (!response.ok) throw new Error('Erro ao buscar dados dos gráficos');
  return response.json();
}
