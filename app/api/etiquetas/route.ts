import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const etiquetas = await sql`
      SELECT * FROM etiqueta 
      WHERE ativo = true 
      ORDER BY nome
    `

    return NextResponse.json(etiquetas)
  } catch (error) {
    console.error("[v0] Error fetching etiquetas:", error)
    return NextResponse.json({ error: "Erro ao buscar etiquetas" }, { status: 500 })
  }
}
