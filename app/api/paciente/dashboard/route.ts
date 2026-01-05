import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idPaciente = searchParams.get("id")

    if (!idPaciente) {
      return NextResponse.json({ error: "ID do paciente é obrigatório" }, { status: 400 })
    }

    // Buscar horários dos medicamentos do paciente
    const horariosResult = await sql`
      SELECT 
        rh.id_horario,
        m.nome as medicamento_nome,
        e.descricao as etiqueta_descricao,
        e.codigo as etiqueta_codigo,
        to_char(rh.horario, 'HH24:MI') as horario,
        rm.frequencia_dia,
        rm.duracao_dias
      FROM medtime.receita_horarios rh
      JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
      JOIN medtime.receitas r ON rm.id_receita = r.id_receita
      JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
      JOIN medtime.etiquetas e ON m.id_etiqueta = e.id_etiqueta
      WHERE r.id_paciente = ${idPaciente}
        AND r.data_inicio IS NOT NULL
        AND (r.data_inicio + rm.duracao_dias * INTERVAL '1 day') >= CURRENT_DATE
      ORDER BY rh.horario
    `

    // Buscar intervenções recentes (últimos 7 dias)
    const intervencoesResult = await sql`
      SELECT 
        ai.data_hora_disparo,
        m.nome as medicamento_nome,
        ai.tomou,
        ai.tentativas
      FROM medtime.app_intervencoes ai
      JOIN medtime.receita_horarios rh ON ai.id_horario = rh.id_horario
      JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
      JOIN medtime.receitas r ON rm.id_receita = r.id_receita
      JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
      WHERE r.id_paciente = ${idPaciente}
        AND ai.data_hora_disparo >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY ai.data_hora_disparo DESC
      LIMIT 50
    `

    return NextResponse.json({
      horarios: horariosResult.rows,
      intervencoes: intervencoesResult.rows,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar dados do dashboard:", error)
    return NextResponse.json({ error: "Erro ao carregar dados" }, { status: 500 })
  }
}
