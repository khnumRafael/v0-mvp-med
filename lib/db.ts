// Database connection utility
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export { sql }

export async function query<T = any>(sqlQuery: string): Promise<T[]> {
  try {
    // Use sql as a tagged template function
    const result = await sql(sqlQuery, [])
    return result as T[]
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

export async function queryOne<T = any>(sqlQuery: string): Promise<T | null> {
  const rows = await query<T>(sqlQuery)
  return rows[0] || null
}
