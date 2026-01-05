import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { query } from "@/lib/db"
import type { AlertaEscalonamento } from "@/lib/types"
import { AlertCircle, Bell, CheckCircle, Clock, MessageSquare, Phone } from "lucide-react"
import Link from "next/link"

async function getAlertasRecentes() {
  try {
    const alertas = await query<
      AlertaEscalonamento & {
        paciente_nome: string
      }
    >(
      `SELECT 
        ae.*,
        p.nome as paciente_nome
       FROM medtime.alertas_escalonamento ae
       JOIN medtime.pacientes p ON ae.id_paciente = p.id_paciente
       ORDER BY ae.created_at DESC
       LIMIT 50`,
    )
    return alertas
  } catch (error) {
    console.error("[v0] Error fetching alertas:", error)
    return []
  }
}

async function getAlertasStats() {
  try {
    const [stats] = await query<{
      total: string
      enviados: string
      pendentes: string
      falhas: string
    }>(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status_entrega = 'enviado') as enviados,
        COUNT(*) FILTER (WHERE status_entrega IS NULL OR status_entrega = 'pendente') as pendentes,
        COUNT(*) FILTER (WHERE status_entrega = 'falha') as falhas
       FROM medtime.alertas_escalonamento
       WHERE created_at >= NOW() - INTERVAL '7 days'`,
    )

    return {
      total: Number.parseInt(stats?.total || "0"),
      enviados: Number.parseInt(stats?.enviados || "0"),
      pendentes: Number.parseInt(stats?.pendentes || "0"),
      falhas: Number.parseInt(stats?.falhas || "0"),
    }
  } catch (error) {
    console.error("[v0] Error fetching alertas stats:", error)
    return { total: 0, enviados: 0, pendentes: 0, falhas: 0 }
  }
}

export default async function AlertasPage() {
  const alertas = await getAlertasRecentes()
  const stats = await getAlertasStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Gestão de Alertas</h2>
          <p className="text-sm text-muted-foreground">Sistema de escalonamento SMS/WhatsApp</p>
        </div>
        <Button asChild>
          <Link href="/admin/alertas/configurar">Configurar Políticas</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total (7 dias)</CardTitle>
            <Bell className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enviados</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.enviados}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            <Clock className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.pendentes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Falhas</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.falhas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertas.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">Nenhum alerta registrado</p>
            ) : (
              alertas.map((alerta) => (
                <div
                  key={alerta.id_alerta}
                  className="flex items-start justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 mt-1">
                      {alerta.tipo_alerta === "SMS" ? (
                        <Phone className="h-4 w-4 text-primary" />
                      ) : alerta.tipo_alerta === "WhatsApp" ? (
                        <MessageSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Bell className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{alerta.paciente_nome}</p>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {alerta.tipo_alerta}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Para: {alerta.destinatario}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alerta.mensagem}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {alerta.enviado_em ? new Date(alerta.enviado_em).toLocaleString("pt-BR") : "Aguardando envio"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={alerta.status_entrega} tentativas={alerta.tentativas} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status, tentativas }: { status?: string; tentativas: number }) {
  if (!status || status === "pendente") {
    return <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">Pendente</span>
  }
  if (status === "enviado") {
    return <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Enviado</span>
  }
  if (status === "entregue") {
    return (
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        Entregue {tentativas > 1 && `(${tentativas} tentativas)`}
      </span>
    )
  }
  return (
    <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
      Falha {tentativas > 0 && `(${tentativas} tentativas)`}
    </span>
  )
}
