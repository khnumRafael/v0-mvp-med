"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlarmClock, Bell, Calendar, CheckCircle2, Heart, LogOut, XCircle, Loader2 } from "lucide-react"

interface Paciente {
  id: string
  nome: string
  cartaoSus: string
  celular: string
  idReceita: string
}

interface MedicamentoHorario {
  id_horario: string
  medicamento_nome: string
  etiqueta_descricao: string
  etiqueta_codigo: string
  horario: string
  frequencia_dia: number
  duracao_dias: number
}

interface IntervencaoRecente {
  data_hora_disparo: string
  medicamento_nome: string
  tomou: boolean | null
  tentativas: number
}

interface DashboardData {
  horarios: MedicamentoHorario[]
  intervencoes: IntervencaoRecente[]
}

export default function PacienteDashboard() {
  const router = useRouter()
  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    horarios: [],
    intervencoes: [],
  })

  useEffect(() => {
    const pacienteData = sessionStorage.getItem("paciente")
    if (!pacienteData) {
      router.push("/paciente")
      return
    }

    const pacienteObj = JSON.parse(pacienteData)
    setPaciente(pacienteObj)

    // Carregar dados do dashboard
    loadDashboardData(pacienteObj.id)
  }, [router])

  const loadDashboardData = async (idPaciente: string) => {
    try {
      const response = await fetch(`/api/paciente/dashboard?id=${idPaciente}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("paciente")
    router.push("/paciente")
  }

  if (loading || !paciente) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  const { horarios, intervencoes } = dashboardData
  const proximoHorario = horarios[0]
  const adesao = intervencoes.length > 0 ? (intervencoes.filter((i) => i.tomou).length / intervencoes.length) * 100 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">MedTime</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 p-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Olá, {paciente.nome.split(" ")[0]}</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus medicamentos e horários</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Próximo Horário</p>
                  <p className="text-2xl font-bold text-foreground">{proximoHorario?.horario || "--:--"}</p>
                </div>
                <AlarmClock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Adesão (7 dias)</p>
                  <p className="text-2xl font-bold text-foreground">{adesao.toFixed(0)}%</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Medicamentos</p>
                  <p className="text-2xl font-bold text-foreground">{horarios.length}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medication Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Seus Horários de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {horarios.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Nenhum medicamento ativo no momento. Consulte seu médico.
              </p>
            ) : (
              horarios.map((horario) => (
                <div
                  key={horario.id_horario}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 border-2 border-primary/20">
                      <span className="text-sm font-bold text-primary">{horario.etiqueta_codigo}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{horario.medicamento_nome}</p>
                      <p className="text-sm text-muted-foreground">{horario.etiqueta_descricao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{horario.horario}</p>
                    <p className="text-xs text-muted-foreground">{horario.frequencia_dia}x ao dia</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {intervencoes.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">Nenhum registro ainda</p>
              ) : (
                intervencoes.slice(0, 5).map((intervencao, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {intervencao.tomou === true ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : intervencao.tomou === false ? (
                        <XCircle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Bell className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">{intervencao.medicamento_nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(intervencao.data_hora_disparo).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {intervencao.tomou === true ? "Tomado" : intervencao.tomou === false ? "Não tomado" : "Pendente"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Precisa de Ajuda?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Em caso de dúvidas sobre seus medicamentos, entre em contato com sua Unidade Básica de Saúde (UBS).
                </p>
                {paciente.celular && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Seu telefone cadastrado: <span className="font-medium text-foreground">{paciente.celular}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
