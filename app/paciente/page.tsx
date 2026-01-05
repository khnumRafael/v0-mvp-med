"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, AlertCircle, Loader2 } from "lucide-react"

export default function PacientePage() {
  const router = useRouter()
  const [cartaoSus, setCartaoSus] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formatCartaoSus = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "")

    // Formata como 000 0000 0000 0000 (15 dígitos)
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`
    if (numbers.length <= 11) return `${numbers.slice(0, 3)} ${numbers.slice(3, 7)} ${numbers.slice(7)}`
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 7)} ${numbers.slice(7, 11)} ${numbers.slice(11, 15)}`
  }

  const handleCartaoSusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCartaoSus(e.target.value)
    setCartaoSus(formatted)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const cartaoSusNumeros = cartaoSus.replace(/\D/g, "")

      if (cartaoSusNumeros.length !== 15) {
        setError("Cartão SUS deve ter 15 dígitos")
        setLoading(false)
        return
      }

      if (!senha) {
        setError("Digite sua senha")
        setLoading(false)
        return
      }

      const response = await fetch("/api/paciente/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartaoSus: cartaoSusNumeros,
          senha,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Erro ao fazer login")
        setLoading(false)
        return
      }

      // Salvar dados do paciente no sessionStorage
      sessionStorage.setItem("paciente", JSON.stringify(data.paciente))

      // Redirecionar para dashboard
      router.push("/paciente/dashboard")
    } catch (err) {
      console.error("[v0] Erro no login:", err)
      setError("Erro ao conectar com o servidor")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground">Portal do Paciente</h1>
          <p className="text-muted-foreground">Acesse seus medicamentos e horários de tomada</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar com Cartão SUS</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cartao-sus" className="text-sm font-medium text-foreground">
                  Número do Cartão SUS
                </label>
                <input
                  id="cartao-sus"
                  type="text"
                  value={cartaoSus}
                  onChange={handleCartaoSusChange}
                  placeholder="000 0000 0000 0000"
                  maxLength={18}
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground">Digite os 15 números do seu Cartão Nacional de Saúde</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="senha" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value)
                    setError("")
                  }}
                  placeholder="Digite sua senha"
                  disabled={loading}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="rounded-lg bg-primary/5 p-4 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Primeira vez?</p>
          <p>A senha foi fornecida junto com sua receita médica na Unidade de Saúde.</p>
        </div>
      </div>
    </div>
  )
}
