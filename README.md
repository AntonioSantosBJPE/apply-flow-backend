# AuthGuard - Backend

Sistema de gerenciamento de autenticação e autorização com foco em permissões granulares para aplicações empresariais, combinando regras RBAC (Role-Based Access Control) e ABAC (Attribute-Based Access Control) de forma dinâmica.

## Visão Geral

Esta API fornece uma solução completa para gerenciamento de usuários, departamentos, cargos, roles e permissões em um ambiente empresarial. Construída com NestJS, TypeScript, Prisma e PostgreSQL, seguindo os princípios de arquitetura limpa e padrões SOLID.

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

- [x] Inicializar projeto NestJS com TypeScript
- [x] Configurar ESLint, Prettier
- [x] Adicionar regras do cursor ao projeto
- [x] Estruturar pastas seguindo arquitetura limpa
- [x] Configurar Docker e Docker Compose para desenvolvimento

### Checkpoint 2: Configuração do Banco de Dados

- [x] Conectar Prisma ao PostgreSQL
- [x] Definir esquemas Prisma para entidades base
- [x] Criar migrações iniciais
- [ ] Implementar seeds para dados iniciais
- [ ] Configurar ambiente de teste com banco separado

### Checkpoint 3: Módulo de Usuários

- [x] Implementar Swagger
- [ ] Implementar registro de usuários
- [ ] Criar sistema de login com JWT
- [ ] Implementar refresh tokens
- [ ] Adicionar recuperação de senha
- [ ] Implementar gerenciamento de sessões ativas

### Checkpoint 4: Módulo de Departamentos e Cargos

- [ ] Implementar CRUD completo para departamentos
- [ ] Implementar CRUD completo para cargos
- [ ] Criar estrutura hierárquica de departamentos
- [ ] Implementar atribuição de cargos a departamentos
- [ ] Adicionar validações de departamentos e cargos em endpoints

### Checkpoint 5: Módulo de Roles

- [ ] Implementar CRUD completo para roles
- [ ] Criar sistema de hierarquia de roles
- [ ] Implementar atribuição de roles a usuários
- [ ] Adicionar validações de roles em endpoints

### Checkpoint 6: Módulo de Permissões

- [ ] Implementar CRUD para permissões
- [ ] Criar CRUD para grupos de permissões
- [ ] Implementar atribuição de permissões a departamentos
- [ ] Implementar atribuição de permissões a cargos
- [ ] Implementar atribuição de permissões a roles
- [ ] Implementar permissões específicas por usuário
- [ ] Desenvolver middleware de verificação de permissões
- [ ] Implementar caching de permissões com Redis

### Checkpoint 7: Sistema de Autorização

- [ ] Implementar middleware de autorização
- [ ] Criar serviço de verificação de permissões
- [ ] Implementar lógica de herança de permissões (departamento > cargo > usuário)
- [ ] Criar guardas para proteção de rotas
- [ ] Implementar verificação de permissões em decorators

### Checkpoint 8: Módulos de Demonstração

- [ ] Criar módulo de "Recursos" com CRUD completo
- [ ] Implementar módulo de "Projetos" com CRUD
- [ ] Aplicar verificações de permissão em operações
- [ ] Criar relacionamentos entre entidades

### Checkpoint 9: Frontend de Administração

- [ ] Criar interface de gerenciamento de departamentos
- [ ] Criar interface de gerenciamento de cargos
- [ ] Implementar interface de atribuição de permissões
- [ ] Desenvolver visualizador de permissões por usuário

### Checkpoint 10: Sistemas de Logs e Auditoria

- [ ] Implementar logs detalhados de atividades
- [ ] Criar endpoint para consulta de logs
- [ ] Adicionar sistema de filtragem e busca em logs
- [ ] Implementar exportação de logs

### Checkpoint 11: Otimização e Segurança

- [ ] Adicionar CORS
- [ ] Implementar rate limiting
- [ ] Adicionar validação e sanitização de inputs
- [ ] Configurar headers de segurança
- [ ] Otimizar queries do banco de dados
- [ ] Implementar testes automatizados

### Checkpoint 12: Documentação

- [ ] Configurar Swagger para documentação da API
- [ ] Documentar todas as rotas e payloads
- [ ] Criar descrições para todas as entidades
- [ ] Documentar fluxos de autenticação e autorização

### Checkpoint 13: Deploy

- [ ] Configurar Husky
- [ ] Configurar Git actions
- [ ] Configurar variáveis de ambiente para produção
- [ ] Criar scripts de migração para produção
- [ ] Configurar Docker para ambiente de produção
- [ ] Implementar pipeline CI/CD

## Estrutura de Diretórios

```
src/
├── core/                # Core do sistema e utilidades
│   ├── constants/       # Constantes do sistema
│   ├── entities/        # Entidades base
│   ├── errors/          # Definições de erros
│   ├── types/           # Tipos comuns
│   ├── utils/           # Funções utilitárias
│   └── either.ts        # Implementação do padrão Either
├── domain/              # Camada de domínio
│   ├── auth/            # Domínio de autenticação
│   ├── user/            # Domínio de usuários
│   ├── department/      # Domínio de departamentos
│   ├── position/        # Domínio de cargos
│   ├── role/            # Domínio de roles
│   ├── permission/      # Domínio de permissões
│   ├── resource/        # Recursos (demonstração)
│   └── project/         # Projetos (demonstração)
├── infra/               # Camada de infraestrutura
│   ├── http/            # Controllers e rotas HTTP
│   │   ├── controllers/ # Controllers organizados por domínio
│   │   ├── presenters/  # Apresentadores de resposta
│   │   ├── http-modules/# Módulos HTTP por domínio
│   │   └── http.module.ts # Módulo HTTP principal
│   ├── database/        # Configuração e repositórios
│   ├── auth/            # Infraestrutura de autenticação
│   ├── file/            # Serviços de manipulação de arquivos
│   ├── queue/           # Implementação de filas
│   ├── mail/            # Serviços de email
│   ├── middlewares/     # Middlewares HTTP
│   └── env/             # Configuração de ambiente
└── main.ts              # Ponto de entrada
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

### Departamentos

- `GET /departments` - Listar departamentos
- `POST /departments` - Criar novo departamento
- `GET /departments/:id` - Obter departamento específico
- `PATCH /departments/:id` - Atualizar departamento
- `DELETE /departments/:id` - Remover departamento
- `GET /departments/:id/permissions` - Listar permissões do departamento
- `POST /departments/:id/permissions` - Atribuir permissão ao departamento

### Cargos

- `GET /positions` - Listar cargos
- `POST /positions` - Criar novo cargo
- `GET /positions/:id` - Obter cargo específico
- `PATCH /positions/:id` - Atualizar cargo
- `DELETE /positions/:id` - Remover cargo
- `GET /positions/:id/permissions` - Listar permissões do cargo
- `POST /positions/:id/permissions` - Atribuir permissão ao cargo

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
- `GET /permission-groups` - Listar grupos de permissões
- `POST /permission-groups` - Criar novo grupo de permissões

### Recursos (demonstração)

- `GET /resources` - Listar recursos
- `POST /resources` - Criar novo recurso
- `GET /resources/:id` - Obter recurso específico
- `PATCH /resources/:id` - Atualizar recurso
- `DELETE /resources/:id` - Remover recurso

### Projetos (demonstração)

- `GET /projects` - Listar projetos
- `POST /projects` - Criar novo projeto
- `GET /projects/:id` - Obter projeto específico
- `PATCH /projects/:id` - Atualizar projeto
- `DELETE /projects/:id` - Remover projeto

## Próximos Passos

1. Clone o repositório
2. Execute `npm install` para instalar dependências
3. Configure o arquivo `.env` baseado no `.env.example`
4. Execute `docker-compose up -d` para iniciar o banco de dados
5. Execute `npx prisma migrate dev` para aplicar migrações
6. Execute `npm run start:dev` para iniciar o servidor de desenvolvimento
