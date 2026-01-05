# Parâmetros de Conexão do Banco de Dados PostgreSQL (Neon)

## Variáveis de Ambiente Disponíveis

Este projeto já está configurado com as seguintes variáveis de ambiente do Neon:

### Conexão Principal (Pooling)
```
DATABASE_URL=postgres://[usuario]:[senha]@[servidor]/[database]?sslmode=require
POSTGRES_URL=postgres://[usuario]:[senha]@[servidor]/[database]?sslmode=require
```

### Conexão Direta (Sem Pooling)
```
DATABASE_URL_UNPOOLED=postgres://[usuario]:[senha]@[servidor]/[database]?sslmode=require
POSTGRES_URL_NON_POOLING=postgres://[usuario]:[senha]@[servidor]/[database]?sslmode=require
POSTGRES_URL_NO_SSL=postgres://[usuario]:[senha]@[servidor]/[database]
```

### Conexão Prisma
```
POSTGRES_PRISMA_URL=postgres://[usuario]:[senha]@[servidor]/[database]?sslmode=require
```

### Parâmetros Individuais

As credenciais também estão disponíveis separadamente:

- **Host/Servidor**: `PGHOST` e `POSTGRES_HOST`
- **Usuário**: `PGUSER` e `POSTGRES_USER`
- **Senha**: `PGPASSWORD` e `POSTGRES_PASSWORD`
- **Database**: `PGDATABASE` e `POSTGRES_DATABASE`
- **Host Unpooled**: `PGHOST_UNPOOLED`

### Project ID Neon
```
NEON_PROJECT_ID=[seu_project_id]
```

## Como Usar Localmente

### 1. Obter as Credenciais no Vercel

As variáveis estão configuradas no seu projeto Vercel. Para usar localmente:

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto "mvp med"
3. Vá em **Settings → Environment Variables**
4. Copie todas as variáveis que começam com `POSTGRES_` ou `PG`

### 2. Criar arquivo .env.local

Na raiz do projeto, crie um arquivo `.env.local`:

```env
# Conexão Neon PostgreSQL
DATABASE_URL="sua_connection_string_aqui"
POSTGRES_URL="sua_connection_string_aqui"
POSTGRES_PRISMA_URL="sua_connection_string_aqui"
DATABASE_URL_UNPOOLED="sua_connection_string_unpooled_aqui"
POSTGRES_URL_NON_POOLING="sua_connection_string_unpooled_aqui"
POSTGRES_URL_NO_SSL="sua_connection_string_sem_ssl_aqui"

# Credenciais Individuais
PGHOST="seu_host.neon.tech"
PGHOST_UNPOOLED="seu_host_unpooled.neon.tech"
PGUSER="seu_usuario"
PGPASSWORD="sua_senha"
PGDATABASE="neondb"
POSTGRES_HOST="seu_host.neon.tech"
POSTGRES_USER="seu_usuario"
POSTGRES_PASSWORD="sua_senha"
POSTGRES_DATABASE="neondb"

# Project ID
NEON_PROJECT_ID="seu_project_id"
```

### 3. Conectar com Cliente PostgreSQL

Para conectar usando ferramentas como **pgAdmin**, **DBeaver** ou **psql**:

**Parâmetros de Conexão:**
- **Host**: Valor de `PGHOST` (ex: `ep-something-123456.us-east-2.aws.neon.tech`)
- **Port**: `5432`
- **Database**: Valor de `PGDATABASE` (geralmente `neondb`)
- **Username**: Valor de `PGUSER`
- **Password**: Valor de `PGPASSWORD`
- **SSL Mode**: `require` (importante para Neon)

**Exemplo com psql:**
```bash
psql "postgresql://[usuario]:[senha]@[host]/[database]?sslmode=require"
```

## Status Atual do Banco de Dados

O banco já está configurado com o schema `medtime` contendo:

✅ **12 tabelas criadas:**
- `pacientes` - Dados dos pacientes (com cartao_sus)
- `receitas` - Prescrições médicas (com senha_hash)
- `medicamentos` - Catálogo de medicamentos
- `etiquetas` - Labels visuais fixos
- `receita_medicamentos` - Medicamentos por receita
- `receita_horarios` - Horários de tomada
- `app_intervencoes` - Histórico de tomadas/alertas
- `alertas_escalonamento` - Sistema de alertas SMS/WhatsApp
- `dispositivos` - Dispositivos móveis sincronizados
- `usuarios_sistema` - Usuários administrativos
- `consentimentos_lgpd` - Consentimentos LGPD
- `auditoria` - Log de auditoria

## Executar Scripts SQL Localmente

Depois de configurar as credenciais, execute os scripts de seed:

```bash
# Via psql
psql $DATABASE_URL -f scripts/001-create-schema.sql
psql $DATABASE_URL -f scripts/002-seed-etiquetas.sql
psql $DATABASE_URL -f scripts/003-seed-medicamentos.sql
psql $DATABASE_URL -f scripts/004-create-escalation-job.sql
psql $DATABASE_URL -f scripts/005-seed-pacientes-teste.sql
```

Ou use a interface administrativa em `/admin/configuracoes` após iniciar o projeto localmente.

## Código de Conexão no Projeto

O projeto usa `@neondatabase/serverless` para conexão:

```typescript
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Usar com tagged template literals
const result = await sql`SELECT * FROM medtime.pacientes`
```

## Suporte

- **Neon Documentation**: https://neon.tech/docs
- **Vercel Integration**: https://vercel.com/integrations/neon
