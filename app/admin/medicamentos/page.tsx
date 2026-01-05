import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import type { Medicamento } from "@/lib/types"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getMedicamentos() {
  try {
    const medicamentos = await sql<(Medicamento & { etiqueta_descricao: string })[]>`
      SELECT m.*, e.descricao as etiqueta_descricao 
      FROM medtime.medicamentos m 
      JOIN medtime.etiquetas e ON m.id_etiqueta = e.id_etiqueta 
      WHERE m.ativo = true 
      ORDER BY m.nome
    `
    return medicamentos
  } catch (error) {
    console.error("[v0] Error fetching medicamentos:", error)
    return []
  }
}

export default async function MedicamentosPage() {
  const medicamentos = await getMedicamentos()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Medicamentos</h2>
          <p className="text-sm text-muted-foreground">Gerenciar cadastro de medicamentos e etiquetas visuais</p>
        </div>
        <Button asChild>
          <Link href="/admin/medicamentos/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Medicamento
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Medicamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Forma</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Concentração</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Etiqueta</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {medicamentos.map((med) => (
                  <tr key={med.id_medicamento} className="border-b border-border">
                    <td className="py-3 text-sm text-foreground">{med.nome}</td>
                    <td className="py-3 text-sm text-muted-foreground">{med.forma_farmaceutica || "-"}</td>
                    <td className="py-3 text-sm text-muted-foreground">{med.concentracao || "-"}</td>
                    <td className="py-3 text-sm text-muted-foreground">{med.etiqueta_descricao}</td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/medicamentos/${med.id_medicamento}`}>Editar</Link>
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
