import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface AdesaoPorMedicamento {
  medicamento_nome: string
  total_doses: number
  doses_tomadas: number
  taxa_adesao: number
}

async function getAdesaoData() {
  try {
    const adesaoPorMedicamento = await sql<AdesaoPorMedicamento>`
      SELECT 
        m.nome as medicamento_nome,
        COUNT(*) as total_doses,
        COUNT(*) FILTER (WHERE ai.tomou = true) as doses_tomadas,
        ROUND(
          (COUNT(*) FILTER (WHERE ai.tomou = true)::NUMERIC / 
          NULLIF(COUNT(*), 0) * 100), 2
        ) as taxa_adesao
       FROM medtime.app_intervencoes ai
       JOIN medtime.receita_horarios rh ON ai.id_horario = rh.id_horario
       JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
       JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
       WHERE ai.data_hora_disparo >= NOW() - INTERVAL '30 days'
       GROUP BY m.nome
       ORDER BY taxa_adesao DESC
    `

    return { adesaoPorMedicamento }
  } catch (error) {
    console.error("[v0] Error fetching adesao data:", error)
    return { adesaoPorMedicamento: [] }
  }
}

export default async function AdesaoReport() {
  const { adesaoPorMedicamento } = await getAdesaoData()

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
          <h2 className="text-2xl font-semibold text-foreground">Relatório de Adesão Medicamentosa</h2>
          <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adesão por Medicamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adesaoPorMedicamento.map((item) => (
              <div key={item.medicamento_nome} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{item.medicamento_nome}</span>
                  <span className="text-sm font-bold text-primary">{item.taxa_adesao.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${item.taxa_adesao}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {item.doses_tomadas} de {item.total_doses} doses
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
