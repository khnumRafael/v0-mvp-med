import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Link2, Phone } from "lucide-react"
import Link from "next/link"

export default function IntegracaoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Integrações</h2>
        <p className="text-sm text-muted-foreground">Captura de receitas ORUS e busca de contatos e-SUS/PEC</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Captura ORUS</CardTitle>
                <p className="text-sm text-muted-foreground">Capturar receitas do sistema ORUS</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground mb-2">Status da Integração</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Ativo</span>
                </div>
              </div>

              <Button className="w-full" asChild>
                <Link href="/admin/integracao/orus/capturar">Capturar Nova Receita</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-3">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle>Busca e-SUS/PEC</CardTitle>
                <p className="text-sm text-muted-foreground">Consultar telefone do paciente</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm text-muted-foreground mb-2">Status da Integração</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm font-medium text-foreground">Disponível</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/admin/integracao/esus/buscar">Buscar Telefone</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Histórico de Capturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Últimas 10 receitas capturadas do ORUS aparecerão aqui</p>
        </CardContent>
      </Card>
    </div>
  )
}
