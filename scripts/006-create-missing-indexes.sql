-- MEDTIME - Additional Indexes for Performance
-- Execute este script para adicionar índices que melhoram as consultas

SET search_path TO medtime;

-- Índice adicional para medicamentos por etiqueta
CREATE INDEX IF NOT EXISTS ix_medicamentos_etiqueta ON medicamentos(id_etiqueta);

-- Índices para pacientes
CREATE INDEX IF NOT EXISTS ix_pacientes_celular ON pacientes(celular);

-- Índices para receitas
CREATE INDEX IF NOT EXISTS ix_receitas_paciente ON receitas(id_paciente);
CREATE INDEX IF NOT EXISTS ix_receitas_data ON receitas(data_receita);

-- Índices para receita_medicamentos
CREATE INDEX IF NOT EXISTS ix_receita_med_receita ON receita_medicamentos(id_receita);
CREATE INDEX IF NOT EXISTS ix_receita_med_medicamento ON receita_medicamentos(id_medicamento);

-- Índices para receita_horarios
CREATE INDEX IF NOT EXISTS ix_horarios_rm ON receita_horarios(id_rm);

-- Índices para dispositivos
CREATE INDEX IF NOT EXISTS ix_dispositivos_paciente ON dispositivos(id_paciente);

-- Índices para app_intervencoes
CREATE INDEX IF NOT EXISTS ix_intervencoes_horario ON app_intervencoes(id_horario);
CREATE INDEX IF NOT EXISTS ix_intervencoes_data ON app_intervencoes(data_hora_disparo);

-- Índices para usuarios_sistema
CREATE INDEX IF NOT EXISTS ix_usuarios_email ON usuarios_sistema(email);

-- Índices para consentimentos_lgpd
CREATE INDEX IF NOT EXISTS ix_consentimentos_paciente ON consentimentos_lgpd(id_paciente);

-- Índices para alertas_escalonamento
CREATE INDEX IF NOT EXISTS ix_alertas_paciente ON alertas_escalonamento(id_paciente);
CREATE INDEX IF NOT EXISTS ix_alertas_status ON alertas_escalonamento(status_entrega);

-- Índices para auditoria
CREATE INDEX IF NOT EXISTS ix_auditoria_usuario ON auditoria(id_usuario);
CREATE INDEX IF NOT EXISTS ix_auditoria_data ON auditoria(created_at);

-- Verificar índices criados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'medtime'
ORDER BY tablename, indexname;
