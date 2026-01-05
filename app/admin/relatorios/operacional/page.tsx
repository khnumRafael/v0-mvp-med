import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { AlertTriangle, ChevronLeft, Phone } from "lucide-react"
import Link from "next/link"

interface PacienteRisco {
  paciente_nome: string
  paciente_celular: string
  medicamento_nome: string
  faltas_consecutivas: number
  ultima_falta: Date
}

async function getPacientesRisco() {
  try {
    const pacientes = await sql<PacienteRisco>`
      SELECT 
        p.nome as paciente_nome,
        p.celular as paciente_celular,
        m.nome as medicamento_nome,
        COUNT(*) as faltas_consecutivas,
        MAX(ai.data_hora_disparo) as ultima_falta
       FROM medtime.app_intervencoes ai
       JOIN medtime.receita_horarios rh ON ai.id_horario = rh.id_horario
       JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
       JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
       JOIN medtime.receitas r ON rm.id_receita = r.id_receita
       JOIN medtime.pacientes p ON r.id_paciente = p.id_paciente
       WHERE ai.tomou = false
       AND ai.data_hora_disparo >= NOW() - INTERVAL '7 days'
       GROUP BY p.id_paciente, p.nome, p.celular, m.nome
       HAVING COUNT(*) >= 2
       ORDER BY COUNT(*) DESC, MAX(ai.data_hora_disparo) DESC
    `

    return pacientes
  } catch (error) {
    console.error("[v0] Error fetching pacientes risco:", error)
    return []
  }
}

export default async function OperacionalReport() {
  const pacientesRisco = await getPacientesRisco()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/relatorios">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Relatório Operacional</h2>
          <p className="text-sm text-muted-foreground">Lista de pacientes para intervenção - ACS/UBS</p>
        </div>
      </div>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Pacientes Prioritários para Intervenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pacientesRisco.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Nenhum paciente em risco identificado no momento
            </p>
          ) : (
            <div className="space-y-3">
              {pacientesRisco.map((paciente, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{paciente.paciente_nome}</h3>
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                          {paciente.faltas_consecutivas} faltas
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{paciente.medicamento_nome}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Última falta: {new Date(paciente.ultima_falta).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {paciente.paciente_celular && (
                        <Button size="sm" variant="outline">
                          <Phone className="mr-2 h-4 w-4" />
                          {paciente.paciente_celular}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instruções para ACS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-medium text-foreground">1.</span>
                <span>Priorize pacientes com 3 ou mais faltas consecutivas</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-foreground">2.</span>
                <span>Entre em contato por telefone antes de realizar visita domiciliar</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-foreground">3.</span>
                <span>Identifique o motivo da não adesão (esquecimento, falta do medicamento, reação adversa)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-foreground">4.</span>
                <span>Registre a intervenção no sistema e encaminhe para profissional quando necessário</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
