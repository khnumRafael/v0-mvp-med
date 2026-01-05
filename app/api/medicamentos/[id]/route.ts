import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await sql`
      SELECT m.*, e.nome as etiqueta_nome, e.cor, e.icone
      FROM medicamento m
      LEFT JOIN etiqueta e ON m.etiqueta_id = e.id
      WHERE m.id = ${params.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Medicamento não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar medicamento" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { nome, principio_ativo, etiqueta_id, apresentacao, concentracao } = body

    const result = await sql`
      UPDATE medicamento
      SET nome = ${nome},
          principio_ativo = ${principio_ativo},
          etiqueta_id = ${etiqueta_id},
          apresentacao = ${apresentacao},
          concentracao = ${concentracao},
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar medicamento" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await sql`
      UPDATE medicamento
      SET ativo = false,
          atualizado_em = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar medicamento" }, { status: 500 })
  }
}
