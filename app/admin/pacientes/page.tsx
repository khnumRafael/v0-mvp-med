import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import type { Paciente } from "@/lib/types"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getPacientes() {
  try {
    const pacientes = await sql<Paciente[]>`
      SELECT * FROM medtime.pacientes 
      ORDER BY created_at DESC 
      LIMIT 50
    `
    return pacientes
  } catch (error) {
    console.error("[v0] Error fetching pacientes:", error)
    return []
  }
}

export default async function PacientesPage() {
  const pacientes = await getPacientes()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Pacientes</h2>
          <p className="text-sm text-muted-foreground">Gerenciar pacientes e histórico de receitas</p>
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
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Nome</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Cartão SUS</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Celular</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">App Instalado</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.id_paciente} className="border-b border-border">
                    <td className="py-3 text-sm text-foreground">{paciente.nome}</td>
                    <td className="py-3 text-sm text-muted-foreground">{paciente.cartao_sus}</td>
                    <td className="py-3 text-sm text-muted-foreground">{paciente.celular || "-"}</td>
                    <td className="py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          paciente.app_instalado === "S"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {paciente.app_instalado === "S" ? "Sim" : "Não"}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/pacientes/${paciente.id_paciente}`}>Ver Detalhes</Link>
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
