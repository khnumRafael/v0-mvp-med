// Health check endpoint for database connectivity

import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as now`
    return NextResponse.json({
      status: "ok",
      database: "connected",
      timestamp: result[0].now,
    })
  } catch (error) {
    return NextResponse.json({ status: "error", database: "disconnected", error: String(error) }, { status: 500 })
  }
}
