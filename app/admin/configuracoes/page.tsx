"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database, CheckCircle2, AlertCircle, Zap } from "lucide-react"

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false)
  const [loadingIndexes, setLoadingIndexes] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [indexResult, setIndexResult] = useState<{ success: boolean; message: string; totalIndexes?: number } | null>(
    null,
  )

  const handleSeedData = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/seed-data", {
        method: "POST",
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Erro ao conectar com o servidor",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteIndexes = async () => {
    setLoadingIndexes(true)
    setIndexResult(null)

    try {
      const response = await fetch("/api/admin/execute-indexes", {
        method: "POST",
      })

      const data = await response.json()
      setIndexResult(data)
    } catch (error) {
      setIndexResult({
        success: false,
        message: "Erro ao conectar com o servidor",
      })
    } finally {
      setLoadingIndexes(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-2">Gerencie as configurações do sistema MedTime</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Índices do Banco de Dados
          </CardTitle>
          <CardDescription>Execute a criação de índices para otimizar a performance das consultas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold mb-2">Índices que serão criados:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Índices de busca para medicamentos, pacientes e receitas</li>
              <li>• Índices de relacionamento entre tabelas</li>
              <li>• Índices para auditoria e rastreamento de alertas</li>
              <li>• Índices temporais para otimizar consultas por data</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Total: 16 índices para melhorar a performance do sistema
            </p>
          </div>

          {indexResult && (
            <Alert variant={indexResult.success ? "default" : "destructive"}>
              {indexResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>
                {indexResult.message}
                {indexResult.totalIndexes && ` (Total de índices no banco: ${indexResult.totalIndexes})`}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={handleExecuteIndexes} disabled={loadingIndexes} size="lg" className="w-full">
            {loadingIndexes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loadingIndexes ? "Executando índices..." : "Executar Índices"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing code for seed data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Dados de Teste
          </CardTitle>
          <CardDescription>Insira pacientes e receitas de teste no banco de dados para desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="font-semibold mb-2">Pacientes que serão criados:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Maria Silva - Cartão SUS: 898001234567890</li>
              <li>• João Santos - Cartão SUS: 898009876543210</li>
              <li>• Ana Costa - Cartão SUS: 898005555666777</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Senha para todos: <span className="font-mono font-semibold">sus123</span>
            </p>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleSeedData} disabled={loading} size="lg" className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Inserindo dados..." : "Inserir Dados de Teste"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
