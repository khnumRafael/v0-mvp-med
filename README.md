# MedTime - Sistema de Adesão Medicamentosa

Plataforma de adesão medicamentosa integrada ao Sistema Único de Saúde (SUS) do Brasil.

## Visão Geral

O MedTime é uma solução completa para melhorar a adesão medicamentosa de pacientes do SUS, combinando:

- **Captura automática** de receitas do sistema ORUS
- **Aplicativo móvel** offline-first com alarmes inteligentes
- **Escalonamento de alertas** (SMS/WhatsApp) para pacientes em risco
- **Dashboard administrativo** para gestão e análise
- **Relatórios operacionais** para ACS e equipes de saúde
- **Indicadores municipais** para gestores públicos

## Estrutura do Projeto

```
medtime/
├── app/                      # Next.js App Router
│   ├── admin/               # Dashboard administrativo
│   │   ├── medicamentos/   # Gestão de medicamentos
│   │   ├── pacientes/      # Gestão de pacientes
│   │   ├── receitas/       # Gestão de receitas
│   │   ├── relatorios/     # Relatórios e analytics
│   │   ├── integracao/     # Integrações ORUS/e-SUS
│   │   └── alertas/        # Gestão de alertas
│   ├── paciente/           # Portal do paciente
│   └── api/                # API Routes
├── components/              # Componentes React
├── lib/                     # Utilitários e módulos
│   ├── db.ts              # Conexão PostgreSQL
│   ├── types.ts           # TypeScript types
│   ├── escalation.ts      # Sistema de escalonamento
│   ├── orus-capture.ts    # Integração ORUS
│   └── esus-integration.ts # Integração e-SUS
└── scripts/                 # Scripts SQL
    ├── 001-create-schema.sql
    ├── 002-seed-etiquetas.sql
    ├── 003-seed-medicamentos.sql
    └── 004-create-escalation-job.sql
```

## Tecnologias

- **Next.js 16** com App Router
- **React 19.2** com Server Components
- **TypeScript** para type safety
- **PostgreSQL** para banco de dados
- **Tailwind CSS v4** para estilização
- **shadcn/ui** para componentes

## Configuração

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://user:pass@host:5432/medtime
SMS_PROVIDER_API_KEY=your_sms_api_key
WHATSAPP_API_KEY=your_whatsapp_api_key
```

### Banco de Dados

Execute os scripts na ordem:

```bash
psql -f scripts/001-create-schema.sql
psql -f scripts/002-seed-etiquetas.sql
psql -f scripts/003-seed-medicamentos.sql
psql -f scripts/004-create-escalation-job.sql
```

### Desenvolvimento

```bash
npm install
npm run dev
```

## Funcionalidades Principais

### 1. Captura de Receitas (ORUS)

- Captura automática via navegador
- Validação de dados estruturados
- Busca de telefone no e-SUS/PEC
- Configuração de horários personalizados

### 2. Portal do Paciente

- Autenticação via Cartão SUS
- Visualização de medicamentos e horários
- Histórico de adesão
- Interface acessível (baixa alfabetização)

### 3. Sistema de Escalonamento

**Fluxo padrão:**
1. Alarme no app (3 reforços a cada 15 min)
2. 2 falhas → SMS ao paciente
3. 3 falhas → WhatsApp ao paciente/cuidador
4. 4+ falhas → Notificação UBS/ACS

### 4. Relatórios e Analytics

- **Adesão medicamentosa** por medicamento, período, UBS
- **Relatório operacional** para ACS (lista diária)
- **Dashboard municipal** para gestores
- **Auditoria completa** para compliance

## Integrações

### ORUS (Captura de Receitas)

Implementado via automação de navegador para capturar dados no momento do envio da receita.

### e-SUS/PEC (Consulta de Telefone)

API para buscar telefone do paciente por Cartão SUS ou CPF.

### SMS/WhatsApp

Integração com provedores de mensagens para alertas de escalonamento.

## Segurança e LGPD

- **Consentimento explícito** no primeiro uso
- **Senhas hasheadas** (bcrypt)
- **Minimização de dados**
- **Trilha de auditoria** completa
- **Perfis de acesso** por necessidade

## Roadmap

- [x] MVP: Alarmes + sync + escalonamento básico
- [ ] Confirmação ativa (tomei/não tomei) com motivos
- [ ] Registro de efeitos adversos
- [ ] Modo cuidador robusto
- [ ] Painel web municipal avançado
- [ ] Predição de abandono com IA

## Licença

Sistema desenvolvido para o SUS - Ministério da Saúde do Brasil
