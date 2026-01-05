import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { Activity, AlertTriangle, Calendar, Users } from "lucide-react"

async function getDashboardStats() {
  try {
    const pacientes = await sql`SELECT COUNT(*) as count FROM medtime.pacientes WHERE app_instalado = 'S'`
    const receitas = await sql`SELECT COUNT(*) as count FROM medtime.receitas WHERE ativa = true`
    const medicamentos = await sql`SELECT COUNT(*) as count FROM medtime.medicamentos WHERE ativo = true`
    const alertas =
      await sql`SELECT COUNT(*) as count FROM medtime.alertas_escalonamento WHERE status_entrega = 'pendente' OR status_entrega IS NULL`

    return {
      pacientes: Number.parseInt(pacientes[0].count as string),
      receitas: Number.parseInt(receitas[0].count as string),
      medicamentos: Number.parseInt(medicamentos[0].count as string),
      alertas: Number.parseInt(alertas[0].count as string),
    }
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return { pacientes: 0, receitas: 0, medicamentos: 0, alertas: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Painel de Controle</h2>
        <p className="text-sm text-muted-foreground">Visão geral do sistema de adesão medicamentosa</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pacientes Ativos" value={stats.pacientes} icon={Users} description="Com app instalado" />
        <StatCard title="Receitas Ativas" value={stats.receitas} icon={Calendar} description="Em andamento" />
        <StatCard title="Medicamentos" value={stats.medicamentos} icon={Activity} description="Cadastrados" />
        <StatCard
          title="Alertas Pendentes"
          value={stats.alertas}
          icon={AlertTriangle}
          description="Requerem atenção"
          variant="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Adesão Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualização de adesão medicamentosa será implementada com dados reais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intervenções Necessárias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Lista de pacientes que requerem intervenção será exibida aqui
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  description: string
  variant?: "default" | "warning"
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${variant === "warning" ? "text-destructive" : "text-primary"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
