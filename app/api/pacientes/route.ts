import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const municipio = searchParams.get("municipio")

    let query = `
      SELECT 
        p.*,
        COUNT(DISTINCT r.id) as total_receitas,
        COUNT(DISTINCT ri.id) as total_medicamentos,
        ROUND(AVG(CASE WHEN i.tipo = 'confirmacao' THEN 1 WHEN i.tipo = 'falha' THEN 0 END) * 100, 1) as taxa_adesao
      FROM paciente p
      LEFT JOIN receita r ON p.id = r.paciente_id
      LEFT JOIN receita_item ri ON r.id = ri.receita_id
      LEFT JOIN intervencao i ON p.id = i.paciente_id
      WHERE p.ativo = true
    `

    if (search) {
      query += ` AND (p.nome ILIKE '%${search}%' OR p.cpf ILIKE '%${search}%' OR p.cns ILIKE '%${search}%')`
    }

    if (municipio) {
      query += ` AND p.municipio = '${municipio}'`
    }

    query += ` GROUP BY p.id ORDER BY p.nome LIMIT 100`

    const pacientes = await sql(query)
    return NextResponse.json(pacientes)
  } catch (error) {
    console.error("[v0] Error fetching pacientes:", error)
    return NextResponse.json({ error: "Erro ao buscar pacientes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, cpf, cns, data_nascimento, telefone, municipio, ubs_vinculada, cuidador_nome, cuidador_telefone } =
      body

    const result = await sql`
      INSERT INTO paciente (
        nome, cpf, cns, data_nascimento, telefone,
        municipio, ubs_vinculada, cuidador_nome, cuidador_telefone
      )
      VALUES (
        ${nome}, ${cpf}, ${cns}, ${data_nascimento}, ${telefone},
        ${municipio}, ${ubs_vinculada}, ${cuidador_nome || null}, ${cuidador_telefone || null}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating paciente:", error)
    return NextResponse.json({ error: "Erro ao criar paciente" }, { status: 500 })
  }
}
