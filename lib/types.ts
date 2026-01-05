// TypeScript types matching the database schema

export interface Etiqueta {
  id_etiqueta: string
  codigo: string
  descricao: string
  imagem_base64: string
  versao: number
  created_at: Date
}

export interface Medicamento {
  id_medicamento: string
  nome: string
  forma_farmaceutica?: string
  concentracao?: string
  id_etiqueta: string
  ativo: boolean
  created_at: Date
  updated_at: Date
}

export interface Paciente {
  id_paciente: string
  cartao_sus: string
  nome: string
  celular?: string
  data_receita: Date
  app_instalado: "S" | "N"
  created_at: Date
}

export interface Receita {
  id_receita: string
  id_paciente: string
  data_receita: Date
  data_inicio?: Date
  origem_receita?: string
  subgrupo_origem?: string
  observacao?: string
  tipo_prescritor?: string
  num_notificacao?: string
  senha_hash: string
  hash_receita?: string
  ativa: boolean
  created_at: Date
}

export interface ReceitaMedicamento {
  id_rm: string
  id_receita: string
  id_medicamento: string
  quantidade_total?: number
  frequencia_dia?: number
  duracao_dias?: number
  dias_a_dispensar?: number
  observacao?: string
  created_at: Date
}

export interface ReceitaHorario {
  id_horario: string
  id_rm: string
  horario: string
  ordem: number
  ativo: boolean
  created_at: Date
}

export interface AppIntervencao {
  id_intervencao: string
  id_horario: string
  data_hora_disparo: Date
  data_hora_desligado?: Date
  tomou?: boolean
  motivo_nao_tomou?: string
  sms_enviado: boolean
  data_sms?: Date
  tentativas: number
  created_at: Date
}

export interface UsuarioSistema {
  id_usuario: string
  nome: string
  email: string
  senha_hash: string
  perfil: "admin" | "profissional" | "gestor" | "acs"
  unidade_saude?: string
  ativo: boolean
  created_at: Date
  updated_at: Date
}

export interface AlertaEscalonamento {
  id_alerta: string
  id_paciente: string
  id_receita: string
  tipo_alerta: "SMS" | "WhatsApp" | "notificacao_ubs"
  destinatario: string
  mensagem: string
  status_entrega?: string
  tentativas: number
  enviado_em?: Date
  entregue_em?: Date
  created_at: Date
}
