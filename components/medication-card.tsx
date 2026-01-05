"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pill, Clock } from "lucide-react"

interface MedicationCardProps {
  medicamento: {
    nome: string
    etiqueta_nome: string
    cor: string
    icone: string
    posologia: string
    horarios: string[]
  }
  onTomar?: () => void
  showActions?: boolean
}

export function MedicationCard({ medicamento, onTomar, showActions = true }: MedicationCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="h-2" style={{ backgroundColor: medicamento.cor }} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ backgroundColor: `${medicamento.cor}20` }}
            >
              {medicamento.icone}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-1 break-words">{medicamento.nome}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {medicamento.etiqueta_nome}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Pill className="w-4 h-4 flex-shrink-0" />
          <span className="break-words">{medicamento.posologia}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex flex-wrap gap-2">
            {medicamento.horarios.map((horario, idx) => (
              <Badge key={idx} variant="secondary" className="font-mono">
                {horario}
              </Badge>
            ))}
          </div>
        </div>

        {showActions && (
          <Button className="w-full mt-2" size="lg" onClick={onTomar}>
            Confirmar Tomada
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
