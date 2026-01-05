// Escalation Management Module
// Handles SMS/WhatsApp alerts for medication adherence

import { sql } from "./db"

export interface EscalationConfig {
  tentativas_reforco: number
  intervalo_reforco: number // minutes
  falhas_para_sms: number
  falhas_para_whatsapp: number
  falhas_para_ubs: number
  habilitar_sms: boolean
  habilitar_whatsapp: boolean
  habilitar_notificacao_ubs: boolean
}

export const DEFAULT_CONFIG: EscalationConfig = {
  tentativas_reforco: 3,
  intervalo_reforco: 15,
  falhas_para_sms: 2,
  falhas_para_whatsapp: 3,
  falhas_para_ubs: 4,
  habilitar_sms: true,
  habilitar_whatsapp: true,
  habilitar_notificacao_ubs: true,
}

/**
 * Check if patient needs escalation and trigger appropriate alert
 */
export async function checkAndEscalate(idHorario: string, config: EscalationConfig = DEFAULT_CONFIG) {
  // Count consecutive failures
  const falhasResult = await sql`
    SELECT COUNT(*) as falhas_consecutivas
     FROM medtime.app_intervencoes
     WHERE id_horario = ${idHorario}
     AND tomou = false
     AND data_hora_disparo >= NOW() - INTERVAL '7 days'
     ORDER BY data_hora_disparo DESC`

  const falhasConsecutivas = Number.parseInt((falhasResult[0]?.falhas_consecutivas as string) || "0")

  if (falhasConsecutivas === 0) {
    return { escalated: false, reason: "No failures" }
  }

  // Get patient and prescription info
  const infoResult = await sql`
    SELECT 
      p.id_paciente,
      r.id_receita,
      p.nome as paciente_nome,
      p.celular,
      m.nome as medicamento_nome
     FROM medtime.receita_horarios rh
     JOIN medtime.receita_medicamentos rm ON rh.id_rm = rm.id_rm
     JOIN medtime.medicamentos m ON rm.id_medicamento = m.id_medicamento
     JOIN medtime.receitas r ON rm.id_receita = r.id_receita
     JOIN medtime.pacientes p ON r.id_paciente = p.id_paciente
     WHERE rh.id_horario = ${idHorario}`

  const info = infoResult[0] as
    | {
        id_paciente: string
        id_receita: string
        paciente_nome: string
        celular: string
        medicamento_nome: string
      }
    | undefined

  if (!info) {
    return { escalated: false, reason: "Patient not found" }
  }

  // Determine escalation level
  let tipoAlerta: "SMS" | "WhatsApp" | "notificacao_ubs" | null = null

  if (
    config.habilitar_sms &&
    falhasConsecutivas >= config.falhas_para_sms &&
    falhasConsecutivas < config.falhas_para_whatsapp
  ) {
    tipoAlerta = "SMS"
  } else if (
    config.habilitar_whatsapp &&
    falhasConsecutivas >= config.falhas_para_whatsapp &&
    falhasConsecutivas < config.falhas_para_ubs
  ) {
    tipoAlerta = "WhatsApp"
  } else if (config.habilitar_notificacao_ubs && falhasConsecutivas >= config.falhas_para_ubs) {
    tipoAlerta = "notificacao_ubs"
  }

  if (!tipoAlerta) {
    return { escalated: false, reason: "Below escalation threshold" }
  }

  // Create escalation alert
  const mensagem = gerarMensagem(info.paciente_nome, info.medicamento_nome, falhasConsecutivas)

  await sql`
    INSERT INTO medtime.alertas_escalonamento
     (id_paciente, id_receita, tipo_alerta, destinatario, mensagem, status_entrega)
     VALUES (${info.id_paciente}, ${info.id_receita}, ${tipoAlerta}, ${info.celular || "Não informado"}, ${mensagem}, 'pendente')`

  return {
    escalated: true,
    tipo: tipoAlerta,
    falhas: falhasConsecutivas,
  }
}

/**
 * Generate alert message based on context
 */
function gerarMensagem(pacienteNome: string, medicamento: string, falhas: number): string {
  const nome = pacienteNome.split(" ")[0] // First name only

  if (falhas === 2) {
    return `Olá ${nome}! Notamos que você não confirmou a tomada do medicamento ${medicamento}. Lembre-se de tomar no horário correto. Em caso de dúvidas, procure sua UBS.`
  } else if (falhas === 3) {
    return `${nome}, estamos preocupados com a adesão ao tratamento de ${medicamento}. Por favor, tome o medicamento conforme prescrito ou entre em contato com a UBS para orientações.`
  } else {
    return `${nome}, identificamos ${falhas} faltas no medicamento ${medicamento}. Um profissional de saúde entrará em contato em breve. Continue o tratamento.`
  }
}

/**
 * Process pending alerts queue
 * This would be called by a scheduled job
 */
export async function processarFilaAlertas() {
  const alertasPendentes = (await sql`
    SELECT id_alerta, tipo_alerta, destinatario, mensagem
     FROM medtime.alertas_escalonamento
     WHERE status_entrega IS NULL OR status_entrega = 'pendente'
     ORDER BY created_at ASC
     LIMIT 100`) as Array<{
    id_alerta: string
    tipo_alerta: string
    destinatario: string
    mensagem: string
  }>

  for (const alerta of alertasPendentes) {
    try {
      if (alerta.tipo_alerta === "SMS") {
        await enviarSMS(alerta.destinatario, alerta.mensagem)
      } else if (alerta.tipo_alerta === "WhatsApp") {
        await enviarWhatsApp(alerta.destinatario, alerta.mensagem)
      }

      // Update status
      await sql`
        UPDATE medtime.alertas_escalonamento
         SET status_entrega = 'enviado', enviado_em = NOW(), tentativas = tentativas + 1
         WHERE id_alerta = ${alerta.id_alerta}`
    } catch (error) {
      console.error(`[v0] Failed to send alert ${alerta.id_alerta}:`, error)

      await sql`
        UPDATE medtime.alertas_escalonamento
         SET status_entrega = 'falha', tentativas = tentativas + 1
         WHERE id_alerta = ${alerta.id_alerta}`
    }
  }

  return { processed: alertasPendentes.length }
}

/**
 * Send SMS via provider
 * Integration with SMS service provider
 */
async function enviarSMS(numero: string, mensagem: string): Promise<void> {
  // This would integrate with actual SMS provider (Twilio, AWS SNS, etc.)
  // For now, just log
  console.log(`[v0] SMS to ${numero}: ${mensagem}`)

  // Mock implementation
  if (process.env.SMS_PROVIDER_API_KEY) {
    // await fetch('https://sms-provider.com/api/send', { ... })
  }
}

/**
 * Send WhatsApp message via provider
 * Integration with WhatsApp Business API
 */
async function enviarWhatsApp(numero: string, mensagem: string): Promise<void> {
  // This would integrate with WhatsApp Business API
  console.log(`[v0] WhatsApp to ${numero}: ${mensagem}`)

  // Mock implementation
  if (process.env.WHATSAPP_API_KEY) {
    // await fetch('https://whatsapp-api.com/send', { ... })
  }
}
