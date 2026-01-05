# 🔐 Credenciais de Teste - MedTime

## Acesso Portal do Paciente

Para testar o portal do paciente, use uma das seguintes credenciais:

### Paciente 1: Maria Silva (Hipertensão)
- **Cartão SUS**: `898001234567890`
- **Senha**: `sus123`
- **Medicamento**: Losartana 50mg
- **Horários**: 08:00, 20:00

### Paciente 2: João Santos (Diabetes)
- **Cartão SUS**: `898009876543210`
- **Senha**: `sus123`
- **Medicamento**: Metformina 850mg
- **Horários**: 08:00, 14:00, 20:00

### Paciente 3: Ana Costa (Colesterol)
- **Cartão SUS**: `898005555666777`
- **Senha**: `sus123`
- **Medicamento**: Sinvastatina 20mg
- **Horários**: 22:00

---

## Como Usar

1. Acesse `/paciente`
2. Digite o número do Cartão SUS (será formatado automaticamente)
3. Digite a senha: `sus123`
4. Clique em "Entrar"

## Observações

- A senha padrão `sus123` é apenas para ambiente de desenvolvimento
- Em produção, cada paciente receberá uma senha única da Unidade de Saúde
- O Cartão SUS é validado (15 dígitos)
- Os dados são fictícios e apenas para demonstração

## Funcionalidades Disponíveis

✅ Login seguro com Cartão SUS  
✅ Visualização de medicamentos e horários  
✅ Registro de tomada de medicamentos  
✅ Histórico de adesão (últimos 7 dias)  
✅ Estatísticas de adesão  
✅ Alarmes e lembretes visuais  
✅ Suporte a cuidadores (múltiplos pacientes)
