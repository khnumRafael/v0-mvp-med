import type React from "react"
import { Activity, BarChart3, Heart, Home, Pill, Settings, Users } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Heart className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-semibold text-foreground">MedTime</span>
        </div>
        <nav className="space-y-1 p-4">
          <NavLink href="/admin" icon={Home}>
            Visão Geral
          </NavLink>
          <NavLink href="/admin/receitas" icon={Pill}>
            Receitas
          </NavLink>
          <NavLink href="/admin/pacientes" icon={Users}>
            Pacientes
          </NavLink>
          <NavLink href="/admin/medicamentos" icon={Activity}>
            Medicamentos
          </NavLink>
          <NavLink href="/admin/relatorios" icon={BarChart3}>
            Relatórios
          </NavLink>
          <NavLink href="/admin/configuracoes" icon={Settings}>
            Configurações
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-lg font-medium text-foreground">Sistema de Gestão MedTime</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Sistema Único de Saúde - SUS</span>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

function NavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  )
}
