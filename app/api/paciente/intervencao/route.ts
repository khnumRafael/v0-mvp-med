import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id_horario, tomou, motivo_nao_tomou } = body

    if (!id_horario || tomou === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await sql`
      INSERT INTO medtime.app_intervencoes 
       (id_horario, data_hora_disparo, data_hora_desligado, tomou, motivo_nao_tomou, tentativas)
       VALUES (${id_horario}, NOW(), NOW(), ${tomou}, ${motivo_nao_tomou || null}, 1)`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error recording intervention:", error)
    return NextResponse.json({ error: "Failed to record intervention" }, { status: 500 })
  }
}
