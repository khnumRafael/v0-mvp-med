import { query } from "@/lib/db"
import type { ORUSReceita } from "@/lib/orus-capture"
import { validateORUSData } from "@/lib/orus-capture"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const data: ORUSReceita = await request.json()

    // Validate captured data
    const validation = validateORUSData(data)
    if (!validation.valid) {
      return NextResponse.json({ error: "Dados inválidos", details: validation.errors }, { status: 400 })
    }

    // Generate password hash for patient
    const senha = Math.random().toString(36).slice(-8)
    const senhaHash = await bcrypt.hash(senha, 10)

    // Insert patient
    const [paciente] = await query<{ id_paciente: string }>(
      `INSERT INTO medtime.pacientes (cartao_sus, nome, data_receita)
       VALUES ($1, $2, $3)
       RETURNING id_paciente`,
      [data.paciente.cartao_sus, data.paciente.nome, data.receita.data_receita],
    )

    // Insert prescription
    const [receita] = await query<{ id_receita: string }>(
      `INSERT INTO medtime.receitas 
       (id_paciente, data_receita, origem_receita, subgrupo_origem, observacao, tipo_prescritor, num_notificacao, senha_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id_receita`,
      [
        paciente.id_paciente,
        data.receita.data_receita,
        data.receita.origem_receita,
        data.receita.subgrupo_origem,
        data.receita.observacao,
        data.receita.tipo_prescritor,
        data.receita.num_notificacao,
        senhaHash,
      ],
    )

    // Insert medications and schedules
    for (const med of data.medicamentos) {
      // Find medication in catalog (simplified - would have more complex matching)
      const [medicamento] = await query<{ id_medicamento: string }>(
        `SELECT id_medicamento FROM medtime.medicamentos WHERE nome ILIKE $1 LIMIT 1`,
        [med.nome],
      )

      if (!medicamento) {
        continue // Skip if medication not in catalog
      }

      const [receitaMed] = await query<{ id_rm: string }>(
        `INSERT INTO medtime.receita_medicamentos
         (id_receita, id_medicamento, quantidade_total, frequencia_dia, duracao_dias, dias_a_dispensar, observacao)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id_rm`,
        [
          receita.id_receita,
          medicamento.id_medicamento,
          med.quantidade_total,
          med.frequencia_dia,
          med.duracao_dias,
          med.dias_a_dispensar,
          med.observacao,
        ],
      )
    }

    return NextResponse.json({
      success: true,
      id_paciente: paciente.id_paciente,
      id_receita: receita.id_receita,
      senha_temporaria: senha,
    })
  } catch (error) {
    console.error("[v0] Error processing ORUS capture:", error)
    return NextResponse.json({ error: "Failed to process prescription" }, { status: 500 })
  }
}
