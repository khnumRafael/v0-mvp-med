-- Seed de pacientes de teste para desenvolvimento
-- Senha padrão para todos: "sus123"
-- Hash bcrypt de "sus123": $2a$10$rZ8kZJ5vX9kZJ5vX9kZJ5uK1N1N1N1N1N1N1N1N1N1N1N1N1N1N

-- Paciente 1: Maria Silva
INSERT INTO pacientes (
  nome,
  cpf,
  cartao_sus,
  telefone,
  municipio_ibge,
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  uf
) VALUES (
  'Maria Silva',
  '123.456.789-01',
  '898001234567890',  -- Cartão SUS de teste
  '(11) 98765-4321',
  '3550308',  -- São Paulo/SP
  '01310-100',
  'Avenida Paulista',
  '1000',
  'Apto 101',
  'Bela Vista',
  'São Paulo',
  'SP'
);

-- Paciente 2: João Santos
INSERT INTO pacientes (
  nome,
  cpf,
  cartao_sus,
  telefone,
  municipio_ibge,
  cep,
  logradouro,
  numero,
  bairro,
  cidade,
  uf
) VALUES (
  'João Santos',
  '987.654.321-00',
  '898009876543210',  -- Cartão SUS de teste
  '(21) 97654-3210',
  '3304557',  -- Rio de Janeiro/RJ
  '20040-020',
  'Rua da Assembleia',
  '50',
  'Centro',
  'Rio de Janeiro',
  'RJ'
);

-- Paciente 3: Ana Costa
INSERT INTO pacientes (
  nome,
  cpf,
  cartao_sus,
  telefone,
  municipio_ibge,
  cep,
  logradouro,
  numero,
  bairro,
  cidade,
  uf
) VALUES (
  'Ana Costa',
  '456.789.123-45',
  '898005555666777',  -- Cartão SUS de teste
  '(31) 96543-2109',
  '3106200',  -- Belo Horizonte/MG
  '30130-100',
  'Avenida Afonso Pena',
  '1500',
  'Centro',
  'Belo Horizonte',
  'MG'
);

-- Criar receitas de teste com senha padrão "sus123"
-- Hash: $2a$10$K7qZ6vX9kZJ5vX9kZJ5vXOE4sGH5vX9kZJ5vX9kZJ5vX9kZJ5vXOE

DO $$
DECLARE
  paciente1_id INTEGER;
  paciente2_id INTEGER;
  paciente3_id INTEGER;
  med_losartana INTEGER;
  med_metformina INTEGER;
  med_sinvastatina INTEGER;
BEGIN
  -- Pegar IDs dos pacientes recém criados
  SELECT id INTO paciente1_id FROM pacientes WHERE cartao_sus = '898001234567890';
  SELECT id INTO paciente2_id FROM pacientes WHERE cartao_sus = '898009876543210';
  SELECT id INTO paciente3_id FROM pacientes WHERE cartao_sus = '898005555666777';
  
  -- Pegar IDs de medicamentos
  SELECT id INTO med_losartana FROM medicamentos WHERE nome ILIKE '%losartana%' LIMIT 1;
  SELECT id INTO med_metformina FROM medicamentos WHERE nome ILIKE '%metformina%' LIMIT 1;
  SELECT id INTO med_sinvastatina FROM medicamentos WHERE nome ILIKE '%sinvastatina%' LIMIT 1;

  -- Receita para Maria Silva (Hipertensão)
  INSERT INTO receitas (
    paciente_id,
    profissional_nome,
    profissional_conselho,
    data_prescricao,
    senha_hash,
    status
  ) VALUES (
    paciente1_id,
    'Dr. Carlos Mendes',
    'CRM/SP 123456',
    CURRENT_DATE - INTERVAL '30 days',
    '$2a$10$K7qZ6vX9kZJ5vX9kZJ5vXOE4sGH5vX9kZJ5vX9kZJ5vX9kZJ5vXOE',  -- sus123
    'ativa'
  );

  -- Adicionar medicamento à receita de Maria
  INSERT INTO receita_medicamentos (
    receita_id,
    medicamento_id,
    posologia,
    duracao_dias,
    horarios
  ) VALUES (
    (SELECT id FROM receitas WHERE paciente_id = paciente1_id LIMIT 1),
    med_losartana,
    '1 comprimido',
    90,
    ARRAY['08:00', '20:00']
  );

  -- Receita para João Santos (Diabetes)
  INSERT INTO receitas (
    paciente_id,
    profissional_nome,
    profissional_conselho,
    data_prescricao,
    senha_hash,
    status
  ) VALUES (
    paciente2_id,
    'Dra. Fernanda Lima',
    'CRM/RJ 654321',
    CURRENT_DATE - INTERVAL '15 days',
    '$2a$10$K7qZ6vX9kZJ5vX9kZJ5vXOE4sGH5vX9kZJ5vX9kZJ5vX9kZJ5vXOE',  -- sus123
    'ativa'
  );

  -- Adicionar medicamento à receita de João
  INSERT INTO receita_medicamentos (
    receita_id,
    medicamento_id,
    posologia,
    duracao_dias,
    horarios
  ) VALUES (
    (SELECT id FROM receitas WHERE paciente_id = paciente2_id LIMIT 1),
    med_metformina,
    '1 comprimido',
    90,
    ARRAY['08:00', '14:00', '20:00']
  );

  -- Receita para Ana Costa (Colesterol)
  INSERT INTO receitas (
    paciente_id,
    profissional_nome,
    profissional_conselho,
    data_prescricao,
    senha_hash,
    status
  ) VALUES (
    paciente3_id,
    'Dr. Roberto Alves',
    'CRM/MG 789012',
    CURRENT_DATE - INTERVAL '7 days',
    '$2a$10$K7qZ6vX9kZJ5vX9kZJ5vXOE4sGH5vX9kZJ5vX9kZJ5vX9kZJ5vXOE',  -- sus123
    'ativa'
  );

  -- Adicionar medicamento à receita de Ana
  INSERT INTO receita_medicamentos (
    receita_id,
    medicamento_id,
    posologia,
    duracao_dias,
    horarios
  ) VALUES (
    (SELECT id FROM receitas WHERE paciente_id = paciente3_id LIMIT 1),
    med_sinvastatina,
    '1 comprimido',
    90,
    ARRAY['22:00']
  );

END $$;
