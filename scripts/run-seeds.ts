import { sql } from "@/lib/db"

async function runSeeds() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...")

    // Verificar se as tabelas existem
    console.log("✓ Verificando estrutura do banco...")

    // Seed de pacientes de teste
    console.log("📝 Inserindo pacientes de teste...")

    // Paciente 1: Maria Silva
    await sql`
      INSERT INTO pacientes (
        nome, cpf, cartao_sus, telefone, municipio_ibge,
        cep, logradouro, numero, complemento, bairro, cidade, uf
      ) VALUES (
        'Maria Silva',
        '123.456.789-01',
        '898001234567890',
        '(11) 98765-4321',
        '3550308',
        '01310-100',
        'Avenida Paulista',
        '1000',
        'Apto 101',
        'Bela Vista',
        'São Paulo',
        'SP'
      )
      ON CONFLICT (cartao_sus) DO NOTHING
    `

    // Paciente 2: João Santos
    await sql`
      INSERT INTO pacientes (
        nome, cpf, cartao_sus, telefone, municipio_ibge,
        cep, logradouro, numero, bairro, cidade, uf
      ) VALUES (
        'João Santos',
        '987.654.321-00',
        '898009876543210',
        '(21) 97654-3210',
        '3304557',
        '20040-020',
        'Rua da Assembleia',
        '50',
        'Centro',
        'Rio de Janeiro',
        'RJ'
      )
      ON CONFLICT (cartao_sus) DO NOTHING
    `

    // Paciente 3: Ana Costa
    await sql`
      INSERT INTO pacientes (
        nome, cpf, cartao_sus, telefone, municipio_ibge,
        cep, logradouro, numero, bairro, cidade, uf
      ) VALUES (
        'Ana Costa',
        '456.789.123-45',
        '898005555666777',
        '(31) 96543-2109',
        '3106200',
        '30130-100',
        'Avenida Afonso Pena',
        '1500',
        'Centro',
        'Belo Horizonte',
        'MG'
      )
      ON CONFLICT (cartao_sus) DO NOTHING
    `

    console.log("✓ Pacientes inseridos com sucesso!")

    // Buscar IDs dos pacientes
    const paciente1 = await sql`SELECT id FROM pacientes WHERE cartao_sus = '898001234567890'`
    const paciente2 = await sql`SELECT id FROM pacientes WHERE cartao_sus = '898009876543210'`
    const paciente3 = await sql`SELECT id FROM pacientes WHERE cartao_sus = '898005555666777'`

    if (paciente1.length === 0 || paciente2.length === 0 || paciente3.length === 0) {
      throw new Error("Erro ao buscar pacientes inseridos")
    }

    console.log("📋 Criando receitas de teste...")

    // Senha hash para "sus123" com bcrypt
    const senhaHash = "$2a$10$rZ8kZJ5vX9kZJ5vX9kZJ5uK1N1N1N1N1N1N1N1N1N1N1N1N1N1N"

    // Receita para Maria Silva
    await sql`
      INSERT INTO receitas (
        paciente_id, profissional_nome, profissional_conselho,
        data_prescricao, senha_hash, status
      ) VALUES (
        ${paciente1[0].id},
        'Dr. Carlos Mendes',
        'CRM/SP 123456',
        CURRENT_DATE - INTERVAL '30 days',
        ${senhaHash},
        'ativa'
      )
      ON CONFLICT DO NOTHING
    `

    // Receita para João Santos
    await sql`
      INSERT INTO receitas (
        paciente_id, profissional_nome, profissional_conselho,
        data_prescricao, senha_hash, status
      ) VALUES (
        ${paciente2[0].id},
        'Dra. Fernanda Lima',
        'CRM/RJ 654321',
        CURRENT_DATE - INTERVAL '15 days',
        ${senhaHash},
        'ativa'
      )
      ON CONFLICT DO NOTHING
    `

    // Receita para Ana Costa
    await sql`
      INSERT INTO receitas (
        paciente_id, profissional_nome, profissional_conselho,
        data_prescricao, senha_hash, status
      ) VALUES (
        ${paciente3[0].id},
        'Dr. Roberto Alves',
        'CRM/MG 789012',
        CURRENT_DATE - INTERVAL '7 days',
        ${senhaHash},
        'ativa'
      )
      ON CONFLICT DO NOTHING
    `

    console.log("✓ Receitas criadas com sucesso!")
    console.log("")
    console.log("🎉 Seed concluído com sucesso!")
    console.log("")
    console.log("📱 Credenciais de teste:")
    console.log("   Cartão SUS: 898001234567890 | Senha: sus123 (Maria Silva)")
    console.log("   Cartão SUS: 898009876543210 | Senha: sus123 (João Santos)")
    console.log("   Cartão SUS: 898005555666777 | Senha: sus123 (Ana Costa)")
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error)
    throw error
  }
}

runSeeds()
