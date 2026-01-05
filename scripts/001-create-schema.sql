-- MEDTIME - PostgreSQL Database Schema
-- Version: 1.0 MVP
-- Created: 2025-12-26

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS medtime;
SET search_path TO medtime;

-- ============================================
-- ETIQUETAS (Visual Labels)
-- Fixed visual labels for medication identification
-- ============================================
CREATE TABLE IF NOT EXISTS etiquetas (
  id_etiqueta     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo          VARCHAR(50) NOT NULL UNIQUE,
  descricao       VARCHAR(200) NOT NULL,
  imagem_base64   TEXT NOT NULL,
  versao          INT NOT NULL DEFAULT 1 CHECK (versao >= 1),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE etiquetas IS 'Visual labels catalog - reusable pictograms for medication identification';
COMMENT ON COLUMN etiquetas.codigo IS 'Unique code for label reference';
COMMENT ON COLUMN etiquetas.imagem_base64 IS 'Base64 encoded image for offline-first support';

-- ============================================
-- MEDICAMENTOS (Medications Master)
-- Central medication registry with fixed label reference
-- ============================================
CREATE TABLE IF NOT EXISTS medicamentos (
  id_medicamento     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome               VARCHAR(200) NOT NULL,
  forma_farmaceutica VARCHAR(60),
  concentracao       VARCHAR(60),
  id_etiqueta        UUID NOT NULL REFERENCES etiquetas(id_etiqueta),
  ativo              BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_medicamentos_nome ON medicamentos(nome);
CREATE INDEX IF NOT EXISTS ix_medicamentos_etiqueta ON medicamentos(id_etiqueta);

COMMENT ON TABLE medicamentos IS 'Master medication catalog - each medication has ONE fixed label';
COMMENT ON COLUMN medicamentos.id_etiqueta IS 'Fixed visual label for this medication (structural rule)';

-- ============================================
-- PACIENTES (Patients)
-- Patient registry per prescription event
-- ============================================
CREATE TABLE IF NOT EXISTS pacientes (
  id_paciente   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartao_sus    VARCHAR(20) NOT NULL CHECK (cartao_sus ~ '^[0-9]+$'),
  nome          VARCHAR(200) NOT NULL,
  celular       VARCHAR(20),
  data_receita  DATE NOT NULL,
  app_instalado CHAR(1) NOT NULL DEFAULT 'N' CHECK (app_instalado IN ('S','N')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_pacientes_cartao_sus ON pacientes(cartao_sus);
CREATE INDEX IF NOT EXISTS ix_pacientes_celular ON pacientes(celular);

COMMENT ON TABLE pacientes IS 'Patient records per prescription event for audit trail';
COMMENT ON COLUMN pacientes.cartao_sus IS 'SUS card number - stored as text to preserve leading zeros';

-- ============================================
-- RECEITAS (Prescriptions)
-- Prescription header linked to patient
-- ============================================
CREATE TABLE IF NOT EXISTS receitas (
  id_receita       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_paciente      UUID NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  data_receita     DATE NOT NULL,
  data_inicio      DATE,
  origem_receita   VARCHAR(80),
  subgrupo_origem  VARCHAR(80),
  observacao       TEXT,
  tipo_prescritor  VARCHAR(30),
  num_notificacao  VARCHAR(40),
  senha_hash       VARCHAR(200) NOT NULL,
  hash_receita     VARCHAR(128),
  ativa            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_receitas_paciente ON receitas(id_paciente);
CREATE INDEX IF NOT EXISTS ix_receitas_data ON receitas(data_receita);

COMMENT ON TABLE receitas IS 'Prescription headers captured from ORUS';
COMMENT ON COLUMN receitas.senha_hash IS 'Hashed password for patient app authentication';

-- ============================================
-- RECEITA_MEDICAMENTOS (Prescription Items)
-- Medications prescribed in each prescription
-- ============================================
CREATE TABLE IF NOT EXISTS receita_medicamentos (
  id_rm            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_receita       UUID NOT NULL REFERENCES receitas(id_receita) ON DELETE CASCADE,
  id_medicamento   UUID NOT NULL REFERENCES medicamentos(id_medicamento),
  quantidade_total NUMERIC(18,3),
  frequencia_dia   INT CHECK (frequencia_dia IS NULL OR frequencia_dia >= 1),
  duracao_dias     INT CHECK (duracao_dias IS NULL OR duracao_dias >= 1),
  dias_a_dispensar INT CHECK (dias_a_dispensar IS NULL OR dias_a_dispensar >= 1),
  observacao       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_receita_med_receita ON receita_medicamentos(id_receita);
CREATE INDEX IF NOT EXISTS ix_receita_med_medicamento ON receita_medicamentos(id_medicamento);

-- ============================================
-- RECEITA_HORARIOS (Scheduled Times)
-- Effective alarm times per medication item
-- ============================================
CREATE TABLE IF NOT EXISTS receita_horarios (
  id_horario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_rm      UUID NOT NULL REFERENCES receita_medicamentos(id_rm) ON DELETE CASCADE,
  horario    TIME NOT NULL,
  ordem      INT NOT NULL DEFAULT 1 CHECK (ordem >= 1),
  ativo      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_horarios_rm ON receita_horarios(id_rm);

COMMENT ON TABLE receita_horarios IS 'Effective alarm times configured per medication';

-- ============================================
-- DISPOSITIVOS (Devices)
-- Device management for multi-patient support
-- ============================================
CREATE TABLE IF NOT EXISTS dispositivos (
  id_dispositivo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_paciente    UUID NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  uuid_device    VARCHAR(80) NOT NULL,
  sistema        VARCHAR(30) NOT NULL DEFAULT 'Android',
  ultimo_sync    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (uuid_device, id_paciente)
);

CREATE INDEX IF NOT EXISTS ix_dispositivos_paciente ON dispositivos(id_paciente);

COMMENT ON TABLE dispositivos IS 'Device registry for sync management and multi-patient support';

-- ============================================
-- APP_INTERVENCOES (App Interventions Log)
-- Alarm events and user interactions
-- ============================================
CREATE TABLE IF NOT EXISTS app_intervencoes (
  id_intervencao      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_horario          UUID NOT NULL REFERENCES receita_horarios(id_horario) ON DELETE CASCADE,
  data_hora_disparo   TIMESTAMPTZ NOT NULL,
  data_hora_desligado TIMESTAMPTZ,
  tomou               BOOLEAN,
  motivo_nao_tomou    VARCHAR(200),
  sms_enviado         BOOLEAN NOT NULL DEFAULT FALSE,
  data_sms            TIMESTAMPTZ,
  tentativas          INT NOT NULL DEFAULT 0 CHECK (tentativas >= 0),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_intervencoes_horario ON app_intervencoes(id_horario);
CREATE INDEX IF NOT EXISTS ix_intervencoes_data ON app_intervencoes(data_hora_disparo);

COMMENT ON TABLE app_intervencoes IS 'Alarm execution log - foundation for adherence tracking';

-- ============================================
-- USUARIOS_SISTEMA (System Users)
-- Health professionals and administrators
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios_sistema (
  id_usuario    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome          VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL UNIQUE,
  senha_hash    VARCHAR(200) NOT NULL,
  perfil        VARCHAR(30) NOT NULL CHECK (perfil IN ('admin', 'profissional', 'gestor', 'acs')),
  unidade_saude VARCHAR(200),
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_usuarios_email ON usuarios_sistema(email);

COMMENT ON TABLE usuarios_sistema IS 'System users - health professionals, managers, and administrators';

-- ============================================
-- CONSENTIMENTOS_LGPD (LGPD Consent Log)
-- Privacy consent tracking
-- ============================================
CREATE TABLE IF NOT EXISTS consentimentos_lgpd (
  id_consentimento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_paciente      UUID NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  tipo_consentimento VARCHAR(50) NOT NULL,
  versao_termo     VARCHAR(20) NOT NULL,
  aceito           BOOLEAN NOT NULL,
  data_aceite      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_origem        VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS ix_consentimentos_paciente ON consentimentos_lgpd(id_paciente);

-- ============================================
-- ALERTAS_ESCALONAMENTO (Escalation Alerts)
-- SMS/WhatsApp escalation tracking
-- ============================================
CREATE TABLE IF NOT EXISTS alertas_escalonamento (
  id_alerta      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_paciente    UUID NOT NULL REFERENCES pacientes(id_paciente) ON DELETE CASCADE,
  id_receita     UUID NOT NULL REFERENCES receitas(id_receita) ON DELETE CASCADE,
  tipo_alerta    VARCHAR(30) NOT NULL CHECK (tipo_alerta IN ('SMS', 'WhatsApp', 'notificacao_ubs')),
  destinatario   VARCHAR(200) NOT NULL,
  mensagem       TEXT NOT NULL,
  status_entrega VARCHAR(30),
  tentativas     INT NOT NULL DEFAULT 0,
  enviado_em     TIMESTAMPTZ,
  entregue_em    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_alertas_paciente ON alertas_escalonamento(id_paciente);
CREATE INDEX IF NOT EXISTS ix_alertas_status ON alertas_escalonamento(status_entrega);

COMMENT ON TABLE alertas_escalonamento IS 'Escalation alerts tracking for SMS/WhatsApp notifications';

-- ============================================
-- AUDITORIA (Audit Trail)
-- System-wide audit log
-- ============================================
CREATE TABLE IF NOT EXISTS auditoria (
  id_audit     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario   UUID REFERENCES usuarios_sistema(id_usuario),
  acao         VARCHAR(100) NOT NULL,
  tabela       VARCHAR(50),
  registro_id  UUID,
  dados_antes  JSONB,
  dados_depois JSONB,
  ip_origem    VARCHAR(50),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_auditoria_usuario ON auditoria(id_usuario);
CREATE INDEX IF NOT EXISTS ix_auditoria_data ON auditoria(created_at);

COMMENT ON TABLE auditoria IS 'Complete audit trail for compliance and security';
