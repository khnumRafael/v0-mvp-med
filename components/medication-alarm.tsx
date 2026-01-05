"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlarmClock, Check, X } from "lucide-react"
import { useState } from "react"

interface MedicationAlarmProps {
  medicationName: string
  labelDescription: string
  time: string
  onConfirm: (taken: boolean, reason?: string) => void
}

export function MedicationAlarm({ medicationName, labelDescription, time, onConfirm }: MedicationAlarmProps) {
  const [showReasons, setShowReasons] = useState(false)

  const reasons = ["Esqueci de tomar", "Não tinha o medicamento", "Senti mal/reação adversa", "Outro motivo"]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4">
      <Card className="w-full max-w-md border-primary">
        <CardContent className="space-y-6 pt-6">
          {/* Alarm Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <AlarmClock className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>

          {/* Time */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Hora do medicamento</p>
            <p className="text-4xl font-bold text-primary">{time}</p>
          </div>

          {/* Visual Label */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-24 w-24 rounded-lg bg-muted/50 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">{labelDescription}</span>
            </div>
            <p className="text-lg font-medium text-foreground text-center">{medicationName}</p>
          </div>

          {/* Action Buttons */}
          {!showReasons ? (
            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowReasons(true)}
              >
                <X className="mr-2 h-5 w-5" />
                Não Tomei
              </Button>
              <Button size="lg" className="flex-1" onClick={() => onConfirm(true)}>
                <Check className="mr-2 h-5 w-5" />
                Tomei
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Por que não tomou?</p>
              {reasons.map((reason) => (
                <Button
                  key={reason}
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => onConfirm(false, reason)}
                >
                  {reason}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
