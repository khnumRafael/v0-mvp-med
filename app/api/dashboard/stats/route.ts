import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get total active patients
    const [{ count: totalPacientes }] = await sql`
      SELECT COUNT(*) as count FROM paciente WHERE ativo = true
    `

    // Get active prescriptions
    const [{ count: receitasAtivas }] = await sql`
      SELECT COUNT(*) as count 
      FROM receita 
      WHERE status IN ('ativa', 'dispensada')
    `

    // Get overall adherence rate
    const [{ taxa_adesao }] = await sql`
      SELECT 
        ROUND(
          COUNT(CASE WHEN tipo = 'confirmacao' THEN 1 END)::decimal / 
          NULLIF(COUNT(*), 0) * 100, 
          1
        ) as taxa_adesao
      FROM intervencao
      WHERE criado_em >= CURRENT_DATE - INTERVAL '30 days'
        AND tipo IN ('confirmacao', 'falha')
    `

    // Get pending alerts
    const [{ count: alertasPendentes }] = await sql`
      SELECT COUNT(*) as count
      FROM alarme
      WHERE status = 'pendente'
        AND horario_agendado <= CURRENT_TIMESTAMP
    `

    return NextResponse.json({
      totalPacientes: Number.parseInt(totalPacientes),
      receitasAtivas: Number.parseInt(receitasAtivas),
      taxaAdesao: Number.parseFloat(taxa_adesao) || 0,
      alertasPendentes: Number.parseInt(alertasPendentes),
    })
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
