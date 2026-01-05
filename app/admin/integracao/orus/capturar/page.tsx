"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CapturarReceitaPage() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedData, setCapturedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCapture = async () => {
    setIsCapturing(true)
    setError(null)

    try {
      // Simulate ORUS capture process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock captured data
      setCapturedData({
        paciente: {
          nome: "João da Silva",
          cartao_sus: "123456789012345",
          celular: "",
        },
        receita: {
          data_receita: new Date().toISOString().split("T")[0],
          origem_receita: "ORUS",
          tipo_prescritor: "Médico",
        },
        medicamentos: [
          {
            nome: "Losartana Potássica",
            quantidade: 30,
            frequencia_dia: 1,
            duracao_dias: 30,
          },
          {
            nome: "Metformina",
            quantidade: 60,
            frequencia_dia: 2,
            duracao_dias: 30,
          },
        ],
      })
    } catch (err) {
      setError("Erro ao capturar dados do ORUS. Verifique a conexão e tente novamente.")
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/integracao">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Capturar Receita ORUS</h2>
          <p className="text-sm text-muted-foreground">Captura automática de dados da prescrição</p>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Erro na Captura</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!capturedData ? (
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Captura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-6">
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <span>Abra o sistema ORUS e navegue até a tela de envio de receita</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <span>Preencha normalmente a receita como de costume</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <span>Clique no botão abaixo e depois clique em "Enviar" no ORUS</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    4
                  </span>
                  <span>O MedTime capturará os dados automaticamente</span>
                </li>
              </ol>
            </div>

            <Button className="w-full" size="lg" onClick={handleCapture} disabled={isCapturing}>
              {isCapturing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Aguardando captura...
                </>
              ) : (
                "Iniciar Captura"
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ReceitaCapturada data={capturedData} />
      )}
    </div>
  )
}

function ReceitaCapturada({ data }: { data: any }) {
  const [celular, setCelular] = useState(data.paciente.celular)
  const [isBuscando, setIsBuscando] = useState(false)
  const [horarios, setHorarios] = useState<Record<number, string[]>>({})

  const buscarTelefone = async () => {
    setIsBuscando(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setCelular("(85) 98765-4321")
    setIsBuscando(false)
  }

  const adicionarHorario = (medIndex: number) => {
    const novosHorarios = { ...horarios }
    if (!novosHorarios[medIndex]) novosHorarios[medIndex] = []
    novosHorarios[medIndex].push("08:00")
    setHorarios(novosHorarios)
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Dados Capturados com Sucesso</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <input
                type="text"
                value={data.paciente.nome}
                readOnly
                className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cartão SUS</label>
              <input
                type="text"
                value={data.paciente.cartao_sus}
                readOnly
                className="mt-1 w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-foreground"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Celular</label>
              <input
                type="text"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="Não informado"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={buscarTelefone} disabled={isBuscando}>
                {isBuscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Buscar no e-SUS</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medicamentos Prescritos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.medicamentos.map((med: any, index: number) => (
            <div key={index} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{med.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    {med.quantidade} unidades - {med.frequencia_dia}x ao dia por {med.duracao_dias} dias
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Horários de Tomada</label>
                {(horarios[index] || []).map((horario, hIndex) => (
                  <input
                    key={hIndex}
                    type="time"
                    value={horario}
                    onChange={(e) => {
                      const novosHorarios = { ...horarios }
                      novosHorarios[index][hIndex] = e.target.value
                      setHorarios(novosHorarios)
                    }}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => adicionarHorario(index)}
                >
                  Adicionar Horário
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 bg-transparent" asChild>
          <Link href="/admin/integracao">Cancelar</Link>
        </Button>
        <Button className="flex-1" asChild>
          <Link href="/admin/receitas">Salvar Receita</Link>
        </Button>
      </div>
    </div>
  )
}
