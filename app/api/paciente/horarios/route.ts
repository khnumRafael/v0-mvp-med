import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pacienteId = searchParams.get("paciente_id")

    if (!pacienteId) {
      return NextResponse.json({ error: "Patient ID required" }, { status: 400 })
    }

    const horarios = await sql`
      SELECT 
        rh.id_horario,
        rh.horario,
        rh.ordem,
        m.nome as medicamento_nome,
        m.forma_farmaceutica,
        m.concentracao,
        e.descricao as etiqueta_descricao,
        e.imagem_base64 as etiqueta_imagem,
        rm.frequencia_dia,
        rm.duracao_dias
       FROM medtime.receita_horarios rh
       JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
       JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
       JOIN medtime.etiquetas e ON m.id_etiqueta = e.id_etiqueta
       JOIN medtime.receitas r ON rm.id_receita = r.id_receita
       WHERE r.id_paciente = ${pacienteId} AND r.ativa = true AND rh.ativo = true
       ORDER BY rh.horario, rh.ordem`

    return NextResponse.json({ horarios })
  } catch (error) {
    console.error("[v0] Error fetching horarios:", error)
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 })
  }
}
