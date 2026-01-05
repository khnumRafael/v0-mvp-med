import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { BarChart3, Download, FileText, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

async function getReportStats() {
  try {
    const adesaoResult = await sql`
      SELECT 
        ROUND(
          (COUNT(*) FILTER (WHERE tomou = true)::NUMERIC / 
          NULLIF(COUNT(*), 0) * 100), 2
        ) as taxa
       FROM medtime.app_intervencoes
       WHERE data_hora_disparo >= NOW() - INTERVAL '30 days'
    `
    const adesaoGeral = adesaoResult[0]

    const riscosResult = await sql`
      SELECT COUNT(DISTINCT ai.id_horario) as count
       FROM medtime.app_intervencoes ai
       WHERE ai.data_hora_disparo >= NOW() - INTERVAL '7 days'
       AND ai.tomou = false
       GROUP BY ai.id_horario
       HAVING COUNT(*) >= 3
    `
    const pacientesRisco = riscosResult[0]

    const intervencoesResult = await sql`
      SELECT COUNT(*) as total
       FROM medtime.app_intervencoes
       WHERE data_hora_disparo >= DATE_TRUNC('month', NOW())
    `
    const intervencoesMes = intervencoesResult[0]

    return {
      adesaoGeral: adesaoGeral?.taxa || 0,
      pacientesRisco: Number.parseInt(pacientesRisco?.count || "0"),
      intervencoesMes: Number.parseInt(intervencoesMes?.total || "0"),
    }
  } catch (error) {
    console.error("[v0] Error fetching report stats:", error)
    return { adesaoGeral: 0, pacientesRisco: 0, intervencoesMes: 0 }
  }
}

export default async function RelatoriosPage() {
  const stats = await getReportStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Relatórios e Análises</h2>
        <p className="text-sm text-muted-foreground">Indicadores de adesão e relatórios gerenciais</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Adesão (30 dias)</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.adesaoGeral.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Doses confirmadas vs. programadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pacientes em Risco</CardTitle>
            <Users className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pacientesRisco}</div>
            <p className="text-xs text-muted-foreground mt-1">3+ faltas na última semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Intervenções (Mês)</CardTitle>
            <BarChart3 className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.intervencoesMes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Alarmes disparados este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/admin/relatorios/adesao">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Adesão Medicamentosa</CardTitle>
                  <p className="text-sm text-muted-foreground">Análise de adesão por período, medicamento e UBS</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ver relatório completo</span>
                <Button variant="ghost" size="sm">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/admin/relatorios/operacional">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-3">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle>Relatório Operacional</CardTitle>
                  <p className="text-sm text-muted-foreground">Pacientes em risco e lista de intervenções</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Lista diária para ACS</span>
                <Button variant="ghost" size="sm">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/admin/relatorios/municipal">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-3/10 p-3">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <CardTitle>Dashboard Municipal</CardTitle>
                  <p className="text-sm text-muted-foreground">Indicadores consolidados por região</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Para gestores municipais</span>
                <Button variant="ghost" size="sm">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <Link href="/admin/relatorios/auditoria">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-chart-4/10 p-3">
                  <FileText className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <CardTitle>Auditoria e Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground">Logs do sistema e rastreabilidade</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trilha de auditoria completa</span>
                <Button variant="ghost" size="sm">
                  Acessar
                </Button>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="bg-transparent">
              Exportar CSV
            </Button>
            <Button variant="outline" className="bg-transparent">
              Exportar Excel
            </Button>
            <Button variant="outline" className="bg-transparent">
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
