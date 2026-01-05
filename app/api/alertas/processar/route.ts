import { processarFilaAlertas } from "@/lib/escalation"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const result = await processarFilaAlertas()
    return NextResponse.json({ success: true, processed: result.processed })
  } catch (error) {
    console.error("[v0] Error processing alerts queue:", error)
    return NextResponse.json({ error: "Failed to process alerts" }, { status: 500 })
  }
}
