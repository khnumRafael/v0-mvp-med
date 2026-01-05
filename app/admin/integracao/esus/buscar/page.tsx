"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Loader2, Search, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function BuscarESUSPage() {
  const [cartaoSus, setCartaoSus] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSearch = async () => {
    if (!cartaoSus || cartaoSus.length < 15) {
      return
    }

    setIsSearching(true)

    try {
      // Simulate e-SUS/PEC lookup
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock results
      setResults({
        nome: "Maria Santos",
        cartao_sus: cartaoSus,
        telefones: [
          { tipo: "Celular", numero: "(85) 99876-5432" },
          { tipo: "Residencial", numero: "(85) 3234-5678" },
        ],
        ultima_atualizacao: "2025-12-20",
      })
    } catch (err) {
      setResults(null)
    } finally {
      setIsSearching(false)
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
          <h2 className="text-2xl font-semibold text-foreground">Buscar no e-SUS/PEC</h2>
          <p className="text-sm text-muted-foreground">Consultar telefone do paciente por Cartão SUS</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buscar Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="cartao-sus" className="text-sm font-medium text-foreground">
              Número do Cartão SUS
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="cartao-sus"
                type="text"
                value={cartaoSus}
                onChange={(e) => setCartaoSus(e.target.value.replace(/\D/g, ""))}
                placeholder="000 0000 0000 0000"
                maxLength={15}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button onClick={handleSearch} disabled={isSearching || cartaoSus.length < 15}>
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Digite os 15 dígitos do Cartão SUS</p>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Encontrados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="grid gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium text-foreground">{results.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cartão SUS</p>
                  <p className="font-medium text-foreground">{results.cartao_sus}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Telefones</p>
              {results.telefones.map((tel: any, index: number) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{tel.numero}</p>
                    <p className="text-xs text-muted-foreground">{tel.tipo}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Copiar
                  </Button>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                Última atualização: {new Date(results.ultima_atualizacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
