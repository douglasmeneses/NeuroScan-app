'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface ClicksChartProps {
  data: {
    usuario: string;
    valor: number;
  }[];
}

const chartConfig = {
  valor: {
    label: "Cliques",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ClicksChart({ data }: ClicksChartProps) {
  // Calcular média de cliques por usuário
  const aggregatedData = data.reduce((acc, item) => {
    const existing = acc.find(i => i.usuario === item.usuario);
    if (existing) {
      existing.total += item.valor;
      existing.count += 1;
    } else {
      acc.push({ usuario: item.usuario, total: item.valor, count: 1 });
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
        <CardTitle>Média de Cliques por Usuário</CardTitle>
        <CardDescription>Média de cliques por resposta de cada usuário</CardDescription>
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
            <Bar dataKey="valor" fill="hsl(var(--chart-1))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
