import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const paciente_id = searchParams.get("paciente_id")
    const status = searchParams.get("status")

    let query = `
      SELECT 
        r.*,
        p.nome as paciente_nome,
        p.cpf as paciente_cpf,
        COUNT(ri.id) as total_medicamentos
      FROM receita r
      JOIN paciente p ON r.paciente_id = p.id
      LEFT JOIN receita_item ri ON r.id = ri.receita_id
      WHERE 1=1
    `

    if (paciente_id) {
      query += ` AND r.paciente_id = ${paciente_id}`
    }

    if (status) {
      query += ` AND r.status = '${status}'`
    }

    query += ` GROUP BY r.id, p.id ORDER BY r.data_receita DESC LIMIT 100`

    const receitas = await sql(query)
    return NextResponse.json(receitas)
  } catch (error) {
    console.error("[v0] Error fetching receitas:", error)
    return NextResponse.json({ error: "Erro ao buscar receitas" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paciente_id, profissional_nome, profissional_crm, data_receita, origem, medicamentos } = body

    // Create receita
    const receitaResult = await sql`
      INSERT INTO receita (
        paciente_id, profissional_nome, profissional_crm, 
        data_receita, origem, status
      )
      VALUES (
        ${paciente_id}, ${profissional_nome}, ${profissional_crm},
        ${data_receita}, ${origem}, 'capturada'
      )
      RETURNING *
    `

    const receita = receitaResult[0]

    // Create receita items
    for (const med of medicamentos) {
      await sql`
        INSERT INTO receita_item (
          receita_id, medicamento_id, posologia, 
          duracao_dias, quantidade_total
        )
        VALUES (
          ${receita.id}, ${med.medicamento_id}, ${med.posologia},
          ${med.duracao_dias}, ${med.quantidade_total}
        )
      `
    }

    return NextResponse.json(receita, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating receita:", error)
    return NextResponse.json({ error: "Erro ao criar receita" }, { status: 500 })
  }
}
