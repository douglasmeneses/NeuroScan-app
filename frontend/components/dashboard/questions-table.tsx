'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TempoQuestionario } from "@/lib/api";
import { formatDuration } from "@/lib/format";

interface QuestionsTableProps {
  data: TempoQuestionario[];
}

export function QuestionsTable({ data }: QuestionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo Médio por Pergunta</CardTitle>
        <CardDescription>Estatísticas de tempo de resposta por pergunta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Questionário</TableHead>
                <TableHead className="text-center">Pergunta</TableHead>
                <TableHead>Texto</TableHead>
                <TableHead className="text-center">Respostas</TableHead>
                <TableHead className="text-center">Tempo Médio</TableHead>
                <TableHead className="text-center">Tempo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.pergunta_id}>
                  <TableCell className="font-medium">{item.questionario_nome}</TableCell>
                  <TableCell className="text-center">#{item.pergunta_numero}</TableCell>
                  <TableCell className="max-w-md truncate">{item.pergunta_texto}</TableCell>
                  <TableCell className="text-center">{item.total_respostas}</TableCell>
                  <TableCell className="text-center">{formatDuration(item.tempo_medio)}</TableCell>
                  <TableCell className="text-center">{formatDuration(item.tempo_total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
