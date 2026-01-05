// ORUS Integration Module
// Browser automation for prescription capture

export interface ORUSReceita {
  paciente: {
    nome: string
    cartao_sus: string
  }
  receita: {
    data_receita: string
    origem_receita: string
    subgrupo_origem?: string
    observacao?: string
    tipo_prescritor: string
    num_notificacao?: string
  }
  medicamentos: Array<{
    nome: string
    forma_farmaceutica?: string
    concentracao?: string
    quantidade_total: number
    frequencia_dia: number
    duracao_dias: number
    dias_a_dispensar?: number
    observacao?: string
  }>
}

/**
 * Captures prescription data from ORUS system
 * This would be implemented as a browser extension or automation script
 */
export async function captureORUSPrescription(): Promise<ORUSReceita> {
  // In production, this would use browser automation (Puppeteer/Playwright)
  // or a browser extension to intercept ORUS form submission

  throw new Error("ORUS capture must be implemented with browser automation")
}

/**
 * Validates ORUS captured data
 */
export function validateORUSData(data: ORUSReceita): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.paciente.nome || data.paciente.nome.length < 3) {
    errors.push("Nome do paciente inválido")
  }

  if (!data.paciente.cartao_sus || !/^\d{15}$/.test(data.paciente.cartao_sus)) {
    errors.push("Cartão SUS deve ter 15 dígitos")
  }

  if (!data.medicamentos || data.medicamentos.length === 0) {
    errors.push("Nenhum medicamento prescrito")
  }

  data.medicamentos.forEach((med, index) => {
    if (!med.nome) {
      errors.push(`Medicamento ${index + 1}: nome obrigatório`)
    }
    if (!med.quantidade_total || med.quantidade_total <= 0) {
      errors.push(`Medicamento ${index + 1}: quantidade inválida`)
    }
    if (!med.frequencia_dia || med.frequencia_dia <= 0) {
      errors.push(`Medicamento ${index + 1}: frequência inválida`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
