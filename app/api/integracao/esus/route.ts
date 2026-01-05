import { buscarPacienteESUS } from "@/lib/esus-integration"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const cartaoSus = searchParams.get("cartao_sus")

    if (!cartaoSus) {
      return NextResponse.json({ error: "Cartão SUS required" }, { status: 400 })
    }

    const paciente = await buscarPacienteESUS(cartaoSus)

    if (!paciente) {
      return NextResponse.json({ error: "Paciente não encontrado" }, { status: 404 })
    }

    return NextResponse.json(paciente)
  } catch (error) {
    console.error("[v0] Error looking up patient in e-SUS:", error)
    return NextResponse.json({ error: "Failed to lookup patient" }, { status: 500 })
  }
}
