import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-6">
            <Heart className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground md:text-5xl">MedTime</h1>

        <p className="text-lg text-muted-foreground md:text-xl">
          Plataforma de adesão medicamentosa integrada ao Sistema Único de Saúde
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/admin">Acessar Sistema</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/paciente">Portal do Paciente</Link>
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">Sistema desenvolvido para o SUS - Ministério da Saúde</div>
      </div>
    </div>
  )
}
