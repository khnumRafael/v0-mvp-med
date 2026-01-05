"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ConfigurarAlertasPage() {
  const [config, setConfig] = useState({
    tentativas_reforco: 3,
    intervalo_reforco: 15,
    falhas_para_sms: 2,
    falhas_para_whatsapp: 3,
    falhas_para_ubs: 4,
    habilitar_sms: true,
    habilitar_whatsapp: true,
    habilitar_notificacao_ubs: true,
  })

  const handleSave = async () => {
    // Would save to database/API
    alert("Configurações salvas com sucesso!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/alertas">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Configurar Políticas de Escalonamento</h2>
          <p className="text-sm text-muted-foreground">Definir regras de alertas automáticos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reforço no Aplicativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Número de tentativas de reforço</label>
            <input
              type="number"
              value={config.tentativas_reforco}
              onChange={(e) => setConfig({ ...config, tentativas_reforco: Number.parseInt(e.target.value) })}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
              min="1"
              max="10"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Quantas vezes repetir o alarme no app antes de escalonar
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Intervalo entre tentativas (minutos)</label>
            <input
              type="number"
              value={config.intervalo_reforco}
              onChange={(e) => setConfig({ ...config, intervalo_reforco: Number.parseInt(e.target.value) })}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
              min="5"
              max="60"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escalonamento de Alertas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">SMS ao Paciente</p>
              <p className="text-sm text-muted-foreground">Enviar após falhas consecutivas no app</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={config.falhas_para_sms}
                onChange={(e) => setConfig({ ...config, falhas_para_sms: Number.parseInt(e.target.value) })}
                className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-center text-foreground"
                min="1"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.habilitar_sms}
                  onChange={(e) => setConfig({ ...config, habilitar_sms: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm text-foreground">Habilitado</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">WhatsApp ao Paciente/Cuidador</p>
              <p className="text-sm text-muted-foreground">Enviar após mais falhas</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={config.falhas_para_whatsapp}
                onChange={(e) => setConfig({ ...config, falhas_para_whatsapp: Number.parseInt(e.target.value) })}
                className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-center text-foreground"
                min="1"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.habilitar_whatsapp}
                  onChange={(e) => setConfig({ ...config, habilitar_whatsapp: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm text-foreground">Habilitado</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-foreground">Notificação UBS/ACS</p>
              <p className="text-sm text-muted-foreground">Alertar equipe de saúde para intervenção</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={config.falhas_para_ubs}
                onChange={(e) => setConfig({ ...config, falhas_para_ubs: Number.parseInt(e.target.value) })}
                className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-center text-foreground"
                min="1"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.habilitar_notificacao_ubs}
                  onChange={(e) => setConfig({ ...config, habilitar_notificacao_ubs: e.target.checked })}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm text-foreground">Habilitado</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Fluxo Padrão Sugerido:</p>
            <ol className="space-y-1 ml-4">
              <li>1. Alarme no app com 3 reforços (intervalo de 15 min)</li>
              <li>2. Após 2 falhas consecutivas: SMS ao paciente</li>
              <li>3. Após 3 falhas: WhatsApp ao paciente e/ou cuidador</li>
              <li>4. Após 4 falhas: Notificação à UBS/ACS para intervenção presencial</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild className="bg-transparent">
          <Link href="/admin/alertas">Cancelar</Link>
        </Button>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  )
}
