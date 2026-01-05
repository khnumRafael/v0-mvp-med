import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST() {
  try {
    console.log("[v0] Executando criação de índices...")

    // Índices adicionais para performance
    const indexes = [
      "CREATE INDEX IF NOT EXISTS ix_medicamentos_etiqueta ON medtime.medicamentos(id_etiqueta)",
      "CREATE INDEX IF NOT EXISTS ix_pacientes_celular ON medtime.pacientes(celular)",
      "CREATE INDEX IF NOT EXISTS ix_receitas_paciente ON medtime.receitas(id_paciente)",
      "CREATE INDEX IF NOT EXISTS ix_receitas_data ON medtime.receitas(data_receita)",
      "CREATE INDEX IF NOT EXISTS ix_receita_med_receita ON medtime.receita_medicamentos(id_receita)",
      "CREATE INDEX IF NOT EXISTS ix_receita_med_medicamento ON medtime.receita_medicamentos(id_medicamento)",
      "CREATE INDEX IF NOT EXISTS ix_horarios_rm ON medtime.receita_horarios(id_rm)",
      "CREATE INDEX IF NOT EXISTS ix_dispositivos_paciente ON medtime.dispositivos(id_paciente)",
      "CREATE INDEX IF NOT EXISTS ix_intervencoes_horario ON medtime.app_intervencoes(id_horario)",
      "CREATE INDEX IF NOT EXISTS ix_intervencoes_data ON medtime.app_intervencoes(data_hora_disparo)",
      "CREATE INDEX IF NOT EXISTS ix_usuarios_email ON medtime.usuarios_sistema(email)",
      "CREATE INDEX IF NOT EXISTS ix_consentimentos_paciente ON medtime.consentimentos_lgpd(id_paciente)",
      "CREATE INDEX IF NOT EXISTS ix_alertas_paciente ON medtime.alertas_escalonamento(id_paciente)",
      "CREATE INDEX IF NOT EXISTS ix_alertas_status ON medtime.alertas_escalonamento(status_entrega)",
      "CREATE INDEX IF NOT EXISTS ix_auditoria_usuario ON medtime.auditoria(id_usuario)",
      "CREATE INDEX IF NOT EXISTS ix_auditoria_data ON medtime.auditoria(created_at)",
    ]

    let created = 0
    for (const indexSQL of indexes) {
      try {
        await sql.query(indexSQL)
        created++
        console.log(`[v0] Índice criado: ${indexSQL.match(/ix_\w+/)?.[0]}`)
      } catch (err: any) {
        console.log(`[v0] Índice já existe ou erro: ${err.message}`)
      }
    }

    // Verificar índices criados
    const result = await sql`
      SELECT 
        schemaname,
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'medtime'
      ORDER BY tablename, indexname
    `

    console.log(`[v0] Total de índices processados: ${created}`)
    console.log(`[v0] Total de índices no schema medtime: ${result.length}`)

    return NextResponse.json({
      success: true,
      message: `${created} índices processados com sucesso`,
      totalIndexes: result.length,
      indexes: result,
    })
  } catch (error: any) {
    console.error("[v0] Erro ao criar índices:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
