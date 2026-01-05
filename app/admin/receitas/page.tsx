import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import type { Receita } from "@/lib/types"
import { Plus } from "lucide-react"
import Link from "next/link"

interface ReceitaComPaciente extends Receita {
  paciente_nome: string
  paciente_cartao_sus: string
}

async function getReceitas() {
  try {
    const receitas = await sql<ReceitaComPaciente[]>`
      SELECT r.*, p.nome as paciente_nome, p.cartao_sus as paciente_cartao_sus
      FROM medtime.receitas r
      JOIN medtime.pacientes p ON r.id_paciente = p.id_paciente
      WHERE r.ativa = true
      ORDER BY r.created_at DESC
      LIMIT 50
    `
    return receitas
  } catch (error) {
    console.error("[v0] Error fetching receitas:", error)
    return []
  }
}

export default async function ReceitasPage() {
  const receitas = await getReceitas()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Receitas</h2>
          <p className="text-sm text-muted-foreground">Gerenciar receitas e prescrições ativas</p>
        </div>
        <Button asChild>
          <Link href="/admin/receitas/novo">
            <Plus className="mr-2 h-4 w-4" />
            Nova Receita
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receitas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Paciente</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Cartão SUS</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Data</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Origem</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((receita) => (
                  <tr key={receita.id_receita} className="border-b border-border">
                    <td className="py-3 text-sm text-foreground">{receita.paciente_nome}</td>
                    <td className="py-3 text-sm text-muted-foreground">{receita.paciente_cartao_sus}</td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {new Date(receita.data_receita).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{receita.origem_receita || "ORUS"}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/receitas/${receita.id_receita}`}>Ver Detalhes</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
