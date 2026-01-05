import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    let query = `
      SELECT m.*, e.nome as etiqueta_nome, e.cor, e.icone
      FROM medicamento m
      LEFT JOIN etiqueta e ON m.etiqueta_id = e.id
      WHERE m.ativo = true
    `

    if (search) {
      query += ` AND (m.nome ILIKE '%${search}%' OR m.principio_ativo ILIKE '%${search}%')`
    }

    query += ` ORDER BY m.nome LIMIT 100`

    const medicamentos = await sql(query)
    return NextResponse.json(medicamentos)
  } catch (error) {
    console.error("[v0] Error fetching medicamentos:", error)
    return NextResponse.json({ error: "Erro ao buscar medicamentos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nome, principio_ativo, etiqueta_id, apresentacao, concentracao } = body

    const result = await sql`
      INSERT INTO medicamento (nome, principio_ativo, etiqueta_id, apresentacao, concentracao)
      VALUES (${nome}, ${principio_ativo}, ${etiqueta_id}, ${apresentacao}, ${concentracao})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating medicamento:", error)
    return NextResponse.json({ error: "Erro ao criar medicamento" }, { status: 500 })
  }
}
