'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface DurationChartProps {
  data: {
    usuario: string;
    valor: number;
  }[];
}

const chartConfig = {
  valor: {
    label: "Duração (s)",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function DurationChart({ data }: DurationChartProps) {
  // Calcular média de duração por usuário e converter de ms para segundos
  const aggregatedData = data.reduce((acc, item) => {
    const existing = acc.find(i => i.usuario === item.usuario);
    const valorEmSegundos = item.valor / 1000;
    if (existing) {
      existing.total += valorEmSegundos;
      existing.count += 1;
    } else {
      acc.push({ usuario: item.usuario, total: valorEmSegundos, count: 1 });
    }
    return acc;
  }, [] as { usuario: string; total: number; count: number }[]);

  const chartData = aggregatedData.map(item => ({
    usuario: item.usuario,
    valor: Math.round((item.total / item.count) * 10) / 10
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo Médio por Usuário</CardTitle>
        <CardDescription>Duração média em segundos por resposta de cada usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="usuario"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="valor" fill="hsl(var(--chart-3))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
