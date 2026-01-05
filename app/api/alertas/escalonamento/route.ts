import { checkAndEscalate } from "@/lib/escalation"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { id_horario } = await request.json()

    if (!id_horario) {
      return NextResponse.json({ error: "id_horario required" }, { status: 400 })
    }

    const result = await checkAndEscalate(id_horario)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error checking escalation:", error)
    return NextResponse.json({ error: "Failed to check escalation" }, { status: 500 })
  }
}
