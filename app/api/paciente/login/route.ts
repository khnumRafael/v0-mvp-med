import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { cartaoSus, senha } = await request.json()

    console.log("[v0] Login attempt:", { cartaoSus })

    if (!cartaoSus || !senha) {
      return NextResponse.json({ error: "Cartão SUS e senha são obrigatórios" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        p.id_paciente,
        p.cartao_sus,
        p.nome,
        p.celular,
        p.app_instalado,
        r.id_receita,
        r.senha_hash,
        r.data_receita,
        r.data_inicio
      FROM medtime.pacientes p
      INNER JOIN medtime.receitas r ON r.id_paciente = p.id_paciente
      WHERE p.cartao_sus = ${cartaoSus}
      ORDER BY r.created_at DESC
      LIMIT 1
    `

    console.log("[v0] Query result:", result)

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Cartão SUS não encontrado" }, { status: 401 })
    }

    const paciente = result[0]

    console.log("[v0] Paciente found:", { id: paciente.id_paciente, nome: paciente.nome })

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, paciente.senha_hash)

    console.log("[v0] Senha válida:", senhaValida)

    if (!senhaValida) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }

    // Marcar app como instalado se ainda não estiver
    if (paciente.app_instalado === "N") {
      await sql`
        UPDATE medtime.pacientes
        SET app_instalado = 'S'
        WHERE id_paciente = ${paciente.id_paciente}
      `
    }

    return NextResponse.json({
      success: true,
      paciente: {
        id: paciente.id_paciente,
        nome: paciente.nome,
        cartaoSus: paciente.cartao_sus,
        celular: paciente.celular,
        idReceita: paciente.id_receita,
      },
    })
  } catch (error) {
    console.error("[v0] Erro no login do paciente:", error)
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 })
  }
}
