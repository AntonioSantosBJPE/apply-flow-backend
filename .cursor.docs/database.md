# ApplyFlow Backend - Database Schema (Simplified)

Este documento descreve o schema simplificado do banco de dados do ApplyFlow Backend, focado no sistema básico de autenticação e criação de contas.

## Visão Geral

O schema foi simplificado para conter apenas as tabelas essenciais para implementar:
- ✅ **Autenticação de usuários**
- ✅ **Criação básica de contas**
- ✅ **Gestão de sessões**
- ✅ **Logs de auditoria**

## Estrutura Simplificada

### Core Authentication Tables

#### Users
- **Usuários** do sistema
- Campos essenciais: email, senha (hash), nome, status ativo, verificação de email
- Relacionamentos: RefreshTokens, AuditLogs

```sql
users:
- id (UUID, PK)
- email (String, unique)
- password_hash (String)
- first_name (String)
- last_name (String)
- is_active (Boolean, default: true)
- is_email_verified (Boolean, default: false)
- last_login (DateTime, nullable)
- created_at (DateTime)
- updated_at (DateTime)
- deleted_at (DateTime, nullable)
```

#### RefreshToken
- **Tokens de refresh** para autenticação JWT
- Campos: token, informações do dispositivo, IP, data de expiração
- Relacionamento: User (many-to-one)

```sql
refresh_tokens:
- id (UUID, PK)
- user_id (UUID, FK -> users.id)
- token (String, unique)
- device_info (String, nullable)
- ip_address (String, nullable)
- expires_at (DateTime)
- created_at (DateTime)
- deleted_at (DateTime, nullable)
```

#### AuditLog
- **Logs de auditoria** para rastreamento de ações
- Campos: ação, recurso, detalhes (JSON), IP
- Relacionamento: User (many-to-one)

```sql
audit_logs:
- id (UUID, PK)
- user_id (UUID, FK -> users.id)
- action (String)
- resource (String)
- resource_id (String, nullable)
- details (JSON, nullable)
- ip_address (String, nullable)
- created_at (DateTime)
- deleted_at (DateTime, nullable)
```

## Setup do Banco de Dados

### 1. Gerar o Cliente Prisma

```bash
npx prisma generate
```

### 2. Executar Migrações

```bash
# Para desenvolvimento
npx prisma migrate dev --name initial_auth_schema

# Para produção
npx prisma migrate deploy
```

### 3. Popular o Banco com Seeds

```bash
npm run db:seed
```

Os seeds incluem:
- **3 usuários de teste** para autenticação
- Senha padrão: `password123`
- Emails: `admin@applyflow.com`, `test@applyflow.com`, `demo@applyflow.com`

### 4. Visualizar o Banco

```bash
npx prisma studio
```

## Funcionalidades Suportadas

### ✅ Autenticação
- Registro de usuário com email/senha
- Login com email/senha
- Tokens JWT com refresh tokens
- Logout (invalidação de tokens)
- Verificação de email

### ✅ Gestão de Usuários
- Criação de conta básica
- Atualização de dados pessoais
- Soft delete de usuários
- Controle de usuários ativos/inativos

### ✅ Segurança
- Hash de senhas com bcrypt
- Rastreamento de sessões por dispositivo/IP
- Logs de auditoria para ações importantes
- Expiração automática de tokens

## Convenções

### Nomenclatura
- **Tabelas**: snake_case no plural (ex: `refresh_tokens`)
- **Campos**: snake_case (ex: `first_name`, `is_active`)
- **IDs**: UUID v4
- **Timestamps**: `created_at`, `updated_at`, `deleted_at`

### Soft Delete
- Utiliza o campo `deleted_at` para soft delete
- Permite recuperação de dados se necessário

### Relacionamentos
- **Foreign keys**: sempre com sufixo `_id`
- **Cascade delete**: aplicado em refresh_tokens quando usuário é removido
- **Unique constraints**: em campos únicos como email e token

## Queries Comuns

### Autenticar usuário
```sql
SELECT id, email, password_hash, is_active, is_email_verified
FROM users 
WHERE email = $1 AND deleted_at IS NULL;
```

### Validar refresh token
```sql
SELECT rt.*, u.is_active, u.deleted_at as user_deleted
FROM refresh_tokens rt
JOIN users u ON rt.user_id = u.id
WHERE rt.token = $1 
  AND rt.expires_at > NOW()
  AND rt.deleted_at IS NULL;
```

### Buscar sessões ativas do usuário
```sql
SELECT token, device_info, ip_address, created_at
FROM refresh_tokens
WHERE user_id = $1 
  AND expires_at > NOW()
  AND deleted_at IS NULL
ORDER BY created_at DESC;
```

### Logs de auditoria do usuário
```sql
SELECT action, resource, resource_id, details, ip_address, created_at
FROM audit_logs
WHERE user_id = $1 
  AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 50;
```

## Performance

### Índices Importantes
- `users.email` (unique, para login)
- `refresh_tokens.token` (unique, para validação)
- `refresh_tokens.user_id` (para buscar sessões)
- `refresh_tokens.expires_at` (para limpeza automática)
- `audit_logs.user_id` (para histórico)
- `audit_logs.created_at` (para ordenação)

### Otimizações Recomendadas
- Limpeza automática de tokens expirados
- Paginação para logs de auditoria
- Connection pooling para alta concorrência
- Cache de dados de usuário frequentemente acessados

## Próximos Passos

Após implementar o sistema básico de autenticação, as próximas funcionalidades podem incluir:

1. **User Profiles** - Perfis detalhados dos usuários
2. **Companies** - Sistema de empresas
3. **Jobs** - Vagas de emprego
4. **Applications** - Sistema de candidaturas
5. **Notifications** - Sistema de notificações
6. **Analytics** - Métricas e relatórios

## Comandos Úteis

```bash
# Reset completo do banco (CUIDADO!)
npx prisma migrate reset

# Verificar status das migrações
npx prisma migrate status

# Gerar nova migração
npx prisma migrate dev --name add_new_feature

# Executar seeds manualmente
npm run db:seed
``` 