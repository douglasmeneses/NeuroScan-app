'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UsuarioStats } from "@/lib/api";
import { formatDuration, formatNumber } from "@/lib/format";
import { Eye } from "lucide-react";

interface UsersTableProps {
  data: UsuarioStats[];
}

export function UsersTable({ data }: UsersTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Usuários</CardTitle>
        <CardDescription>Dados agregados de interação por usuário</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead className="text-center">Cliques</TableHead>
              <TableHead className="text-center">Passos</TableHead>
              <TableHead className="text-center">Tempo Total</TableHead>
              <TableHead className="text-center">Tempo Médio</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{usuario.iniciais_do_nome}</Badge>
                </TableCell>
                <TableCell className="text-center">{formatNumber(usuario.total_cliques)}</TableCell>
                <TableCell className="text-center">{formatNumber(usuario.total_passos)}</TableCell>
                <TableCell className="text-center">{formatDuration(usuario.tempo_total)}</TableCell>
                <TableCell className="text-center">{formatDuration(usuario.tempo_medio_por_resposta)}</TableCell>
                <TableCell className="text-center">
                  <Link 
                    href={`/usuario/${usuario.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalhes
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
