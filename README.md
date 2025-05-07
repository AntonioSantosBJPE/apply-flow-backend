# AuthGuard - Backend

Sistema de gerenciamento de autenticação e autorização com foco em permissões granulares para aplicações empresariais.

## Visão Geral

Esta API fornece uma solução completa para gerenciamento de usuários, roles e permissões em um ambiente empresarial. Construída com NestJS, TypeScript, Prisma e PostgreSQL, seguindo os princípios de arquitetura limpa e padrões SOLID.

## Tecnologias Utilizadas

- Node.js (v18+)
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker & Docker Compose
- Jest para testes
- JWT para autenticação

## Checkpoints de Desenvolvimento

### Checkpoint 1: Setup Inicial

- [ ] Inicializar projeto NestJS com TypeScript
- [ ] Configurar ESLint, Prettier e Git Hooks
- [ ] Estruturar pastas seguindo arquitetura limpa
- [ ] Configurar Docker e Docker Compose para desenvolvimento
- [ ] Conectar Prisma ao PostgreSQL

### Checkpoint 2: Configuração do Banco de Dados

- [ ] Definir esquemas Prisma para entidades base
- [ ] Criar migrações iniciais
- [ ] Implementar seeds para dados iniciais
- [ ] Configurar ambiente de teste com banco separado

### Checkpoint 3: Módulo de Usuários

- [ ] Implementar registro de usuários
- [ ] Criar sistema de login com JWT
- [ ] Implementar refresh tokens
- [ ] Adicionar recuperação de senha
- [ ] Implementar gerenciamento de sessões ativas

### Checkpoint 4: Módulo de Roles

- [ ] Implementar CRUD completo para roles
- [ ] Criar sistema de hierarquia de roles
- [ ] Implementar atribuição de roles a usuários
- [ ] Adicionar validações de roles em endpoints

### Checkpoint 5: Módulo de Permissões

- [ ] Implementar CRUD para permissões
- [ ] Criar sistema de atribuição de permissões a roles
- [ ] Implementar permissões específicas por usuário
- [ ] Desenvolver middleware de verificação de permissões
- [ ] Implementar caching de permissões com Redis

### Checkpoint 6: Módulos de Demonstração

- [ ] Criar módulo de "Recursos" com CRUD completo
- [ ] Implementar módulo de "Projetos" com CRUD
- [ ] Aplicar verificações de permissão em operações
- [ ] Criar relacionamentos entre entidades

### Checkpoint 7: Sistemas de Logs e Auditoria

- [ ] Implementar logs detalhados de atividades
- [ ] Criar endpoint para consulta de logs
- [ ] Adicionar sistema de filtragem e busca em logs
- [ ] Implementar exportação de logs

### Checkpoint 8: Otimização e Segurança

- [ ] Implementar rate limiting
- [ ] Adicionar validação e sanitização de inputs
- [ ] Configurar headers de segurança
- [ ] Otimizar queries do banco de dados
- [ ] Implementar testes automatizados

### Checkpoint 9: Documentação

- [ ] Configurar Swagger para documentação da API
- [ ] Documentar todas as rotas e payloads
- [ ] Criar descrições para todas as entidades
- [ ] Documentar fluxos de autenticação e autorização

### Checkpoint 10: Deploy

- [ ] Configurar variáveis de ambiente para produção
- [ ] Criar scripts de migração para produção
- [ ] Configurar Docker para ambiente de produção
- [ ] Implementar pipeline CI/CD

## Estrutura de Diretórios

```
src/
├── config/               # Configurações do app
├── modules/              # Módulos principais
│   ├── auth/             # Autenticação
│   ├── users/            # Usuários
│   ├── roles/            # Funções
│   ├── permissions/      # Permissões
│   ├── resources/        # Recursos (demonstração)
│   └── projects/         # Projetos (demonstração)
├── shared/               # Código compartilhado
│   ├── decorators/       # Decorators personalizados
│   ├── guards/           # Guards de autenticação/autorização
│   ├── interceptors/     # Interceptors
│   ├── filters/          # Filtros de exceção
│   ├── pipes/            # Pipes de validação
│   └── utils/            # Utilitários
└── main.ts               # Ponto de entrada
```

## Comandos Principais

```bash
# Desenvolvimento
$ npm run start:dev

# Testes unitários
$ npm run test

# Testes e2e
$ npm run test:e2e

# Build para produção
$ npm run build

# Executar em produção
$ npm run start:prod

# Executar migrações do Prisma
$ npx prisma migrate dev

# Gerar client do Prisma
$ npx prisma generate
```

## API Endpoints

### Autenticação

- `POST /auth/register` - Registro de novo usuário
- `POST /auth/login` - Login de usuário
- `POST /auth/refresh-token` - Atualizar token de acesso
- `POST /auth/forgot-password` - Solicitar redefinição de senha
- `POST /auth/reset-password` - Redefinir senha
- `GET /auth/sessions` - Listar sessões ativas
- `DELETE /auth/sessions/:id` - Encerrar sessão específica

### Usuários

- `GET /users` - Listar usuários
- `GET /users/:id` - Obter usuário específico
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Desativar usuário
- `GET /users/:id/roles` - Listar roles do usuário
- `GET /users/:id/permissions` - Listar permissões do usuário

### Roles

- `GET /roles` - Listar roles
- `POST /roles` - Criar nova role
- `GET /roles/:id` - Obter role específica
- `PATCH /roles/:id` - Atualizar role
- `DELETE /roles/:id` - Remover role
- `POST /roles/:id/permissions` - Atribuir permissão a role
- `DELETE /roles/:id/permissions/:permissionId` - Remover permissão de role

### Permissões

- `GET /permissions` - Listar permissões
- `POST /permissions` - Criar nova permissão
- `GET /permissions/:id` - Obter permissão específica
- `PATCH /permissions/:id` - Atualizar permissão
- `DELETE /permissions/:id` - Remover permissão

### Recursos (demonstração)

- `GET /resources` - Listar recursos
- `POST /resources` - Criar novo recurso
- `GET /resources/:id` - Obter recurso específico
- `PATCH /resources/:id` - Atualizar recurso
- `DELETE /resources/:id` - Remover recurso

## Próximos Passos

1. Clone o repositório
2. Execute `npm install` para instalar dependências
3. Configure o arquivo `.env` baseado no `.env.example`
4. Execute `docker-compose up -d` para iniciar o banco de dados
5. Execute `npx prisma migrate dev` para aplicar migrações
6. Execute `npm run start:dev` para iniciar o servidor de desenvolvimento
