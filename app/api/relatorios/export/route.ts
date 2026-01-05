import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo")
    const formato = searchParams.get("formato") || "json"

    let data: any[] = []

    switch (tipo) {
      case "adesao":
        data = await sql`
          SELECT 
            m.nome as medicamento,
            COUNT(*) as total_doses,
            COUNT(*) FILTER (WHERE ai.tomou = true) as doses_tomadas,
            ROUND((COUNT(*) FILTER (WHERE ai.tomou = true)::NUMERIC / NULLIF(COUNT(*), 0) * 100), 2) as taxa_adesao
           FROM medtime.app_intervencoes ai
           JOIN medtime.receita_horarios rh ON ai.id_horario = rh.id_horario
           JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
           JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
           GROUP BY m.nome
           ORDER BY taxa_adesao DESC`
        break

      case "operacional":
        data = await sql`
          SELECT 
            p.nome as paciente,
            p.celular,
            m.nome as medicamento,
            COUNT(*) as faltas
           FROM medtime.app_intervencoes ai
           JOIN medtime.receita_horarios rh ON ai.id_horario = rh.id_horario
           JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
           JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
           JOIN medtime.receitas r ON rm.id_receita = r.id_receita
           JOIN medtime.pacientes p ON r.id_paciente = p.id_paciente
           WHERE ai.tomou = false
           GROUP BY p.id_paciente, p.nome, p.celular, m.nome
           HAVING COUNT(*) >= 2
           ORDER BY COUNT(*) DESC`
        break

      default:
        return NextResponse.json({ error: "Tipo de relatório não especificado" }, { status: 400 })
    }

    if (formato === "csv") {
      // Convert to CSV
      const headers = Object.keys(data[0] || {})
      const csv = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => {
              const value = row[header]
              return typeof value === "string" ? `"${value}"` : value
            })
            .join(","),
        ),
      ].join("\n")

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="relatorio_${tipo}_${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error exporting report:", error)
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 })
  }
}
