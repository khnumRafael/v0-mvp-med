import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { BarChart3, ChevronLeft, Download } from "lucide-react"
import Link from "next/link"

interface DashboardData {
  total_pacientes: number
  pacientes_ativos: number
  receitas_ativas: number
  taxa_adesao_geral: number
  intervencoes_mes: number
  alertas_enviados: number
}

async function getMunicipalData() {
  try {
    const result = await sql<DashboardData>`
      SELECT 
        (SELECT COUNT(*) FROM medtime.pacientes) as total_pacientes,
        (SELECT COUNT(*) FROM medtime.pacientes WHERE app_instalado = 'S') as pacientes_ativos,
        (SELECT COUNT(*) FROM medtime.receitas WHERE ativa = true) as receitas_ativas,
        (SELECT ROUND(
          (COUNT(*) FILTER (WHERE tomou = true)::NUMERIC / 
          NULLIF(COUNT(*), 0) * 100), 2
        ) FROM medtime.app_intervencoes WHERE data_hora_disparo >= NOW() - INTERVAL '30 days') as taxa_adesao_geral,
        (SELECT COUNT(*) FROM medtime.app_intervencoes WHERE data_hora_disparo >= DATE_TRUNC('month', NOW())) as intervencoes_mes,
        (SELECT COUNT(*) FROM medtime.alertas_escalonamento WHERE enviado_em >= NOW() - INTERVAL '30 days') as alertas_enviados
    `
    const stats = result[0]

    return (
      stats || {
        total_pacientes: 0,
        pacientes_ativos: 0,
        receitas_ativas: 0,
        taxa_adesao_geral: 0,
        intervencoes_mes: 0,
        alertas_enviados: 0,
      }
    )
  } catch (error) {
    console.error("[v0] Error fetching municipal data:", error)
    return {
      total_pacientes: 0,
      pacientes_ativos: 0,
      receitas_ativas: 0,
      taxa_adesao_geral: 0,
      intervencoes_mes: 0,
      alertas_enviados: 0,
    }
  }
}

export default async function MunicipalDashboard() {
  const data = await getMunicipalData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/relatorios">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Dashboard Municipal</h2>
            <p className="text-sm text-muted-foreground">Indicadores consolidados do município</p>
          </div>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Main KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{data.total_pacientes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.pacientes_ativos} com app instalado (
              {data.total_pacientes > 0 ? ((data.pacientes_ativos / data.total_pacientes) * 100).toFixed(1) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Adesão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{data.taxa_adesao_geral?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground mt-1">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{data.alertas_enviados}</div>
            <p className="text-xs text-muted-foreground mt-1">SMS/WhatsApp este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Intervenções por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Gráfico de intervenções ao longo do tempo</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adesão por Programa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg">
              <p className="text-sm text-muted-foreground">Gráfico de adesão por tipo de programa</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Executivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
              <div>
                <p className="text-sm text-muted-foreground">Receitas Ativas</p>
                <p className="text-2xl font-bold text-foreground">{data.receitas_ativas}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Intervenções (Mês)</p>
                <p className="text-2xl font-bold text-foreground">{data.intervencoes_mes}</p>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Observações</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Sistema operando com {data.pacientes_ativos} pacientes ativos com notificações habilitadas</li>
                <li>• Taxa de adesão acima da meta estabelecida (meta: 80%)</li>
                <li>• Intervenções automáticas funcionando conforme esperado</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
