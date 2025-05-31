# ApplyFlow - Backend

Sistema backend para candidatos centralizarem e organizarem suas candidaturas de vagas de emprego de diferentes plataformas, com foco em acompanhamento personalizado de status e análise de tendências dos processos seletivos.

## Visão Geral

Esta API fornece uma solução para candidatos organizarem seus processos seletivos de forma centralizada. O sistema permite que candidatos registrem suas candidaturas de diferentes plataformas (LinkedIn, Indeed, Catho, etc.) e acompanhem cada processo com status personalizados. Construída com NestJS, TypeScript, Prisma e PostgreSQL, seguindo os princípios de arquitetura limpa e padrões SOLID.

## Tecnologias Utilizadas

- Node.js (v18+)
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker & Docker Compose
- Vitest para testes
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
- [ ] Definir esquemas Prisma para entidades core
- [ ] Criar migrações iniciais
- [ ] Implementar seeds para dados iniciais (sites de vagas)
- [ ] Configurar ambiente de teste com banco separado

### Checkpoint 3: Módulo de Autenticação

- [x] Implementar Swagger
- [ ] Criar sistema de login com JWT
- [ ] Implementar refresh tokens
- [ ] Implementar registro de usuários
- [ ] Adicionar recuperação de senha
- [ ] Implementar gerenciamento de sessões ativas

### Checkpoint 4: Módulo de Usuários

- [ ] Implementar perfil do candidato
- [ ] Configurações de preferências
- [ ] Dashboard personalizada
- [ ] Gerenciamento de conta

### Checkpoint 5: Módulo Core - Sites de Vagas

- [ ] Implementar CRUD para sites de vagas (admin)
- [ ] Lista global de sites/plataformas pré-cadastradas
- [ ] Sistema de busca e seleção de sites
- [ ] Categorização de sites (LinkedIn, Indeed, Catho, etc.)

### Checkpoint 6: Módulo Core - Status Personalizados

- [ ] Implementar CRUD de status personalizados por usuário
- [ ] Status padrão do sistema
- [ ] Reordenação de status (workflow)
- [ ] Cores e ícones para status

### Checkpoint 7: Módulo Core - Candidaturas

- [ ] Implementar CRUD completo para candidaturas
- [ ] Seleção de site de vaga na criação
- [ ] Atribuição de status personalizados
- [ ] Campos essenciais: título da vaga, empresa, link, observações
- [ ] Upload de currículo utilizado
- [ ] Sistema de busca e filtros

### Checkpoint 8: Dashboard e Visualizações

- [ ] Dashboard com visão geral das candidaturas
- [ ] Gráficos de status ao longo do tempo
- [ ] Estatísticas por site de vaga
- [ ] Timeline de atividades
- [ ] Relatórios básicos

### Checkpoint 9: Recursos Avançados (Futuro)

- [ ] Sistema de notificações e lembretes
- [ ] Exportação de dados
- [ ] Análise de tendências
- [ ] Integração com calendário
- [ ] Backup de dados

### Checkpoint 10: Otimização e Segurança

- [ ] Adicionar CORS
- [ ] Implementar rate limiting
- [ ] Adicionar validação e sanitização de inputs
- [ ] Configurar headers de segurança
- [ ] Otimizar queries do banco de dados
- [ ] Implementar testes automatizados

### Checkpoint 11: Documentação

- [ ] Configurar Swagger para documentação da API
- [ ] Documentar todas as rotas e payloads
- [ ] Criar descrições para todas as entidades
- [ ] Documentar fluxos de autenticação

### Checkpoint 12: Deploy

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
│   ├── user/            # Domínio de usuários/candidatos
│   ├── application/     # Domínio de candidaturas
│   ├── job-site/        # Domínio de sites de vagas
│   ├── status/          # Domínio de status personalizados
│   └── analytics/       # Domínio de analytics (futuro)
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

- `POST /auth/register` - Registro de novo candidato
- `POST /auth/login` - Login de candidato
- `POST /auth/refresh-token` - Atualizar token de acesso
- `POST /auth/forgot-password` - Solicitar redefinição de senha
- `POST /auth/reset-password` - Redefinir senha
- `GET /auth/sessions` - Listar sessões ativas
- `DELETE /auth/sessions/:id` - Encerrar sessão específica

### Perfil do Candidato

- `GET /profile` - Obter perfil do candidato
- `PATCH /profile` - Atualizar perfil do candidato
- `DELETE /account` - Excluir conta
- `GET /dashboard` - Dashboard personalizada

### Sites de Vagas

- `GET /job-sites` - Listar sites de vagas disponíveis
- `GET /job-sites/search` - Buscar sites por nome

### Status Personalizados

- `GET /status` - Listar status do candidato
- `POST /status` - Criar novo status personalizado
- `PATCH /status/:id` - Atualizar status
- `DELETE /status/:id` - Remover status
- `PATCH /status/reorder` - Reordenar status

### Candidaturas

- `GET /applications` - Listar candidaturas
- `POST /applications` - Criar nova candidatura
- `GET /applications/:id` - Obter candidatura específica
- `PATCH /applications/:id` - Atualizar candidatura
- `DELETE /applications/:id` - Remover candidatura
- `PATCH /applications/:id/status` - Atualizar status da candidatura
- `POST /applications/:id/documents` - Adicionar documentos
- `GET /applications/stats` - Estatísticas de candidaturas

### Dashboard e Analytics

- `GET /dashboard/overview` - Visão geral das candidaturas
- `GET /dashboard/charts` - Dados para gráficos
- `GET /analytics/trends` - Análise de tendências
- `GET /analytics/by-site` - Estatísticas por site
- `GET /analytics/timeline` - Timeline de atividades

## Próximos Passos

1. Clone o repositório
2. Execute `npm install` para instalar dependências
3. Configure o arquivo `.env` baseado no `.env.example`
4. Execute `docker-compose up -d` para iniciar o banco de dados
5. Execute `npx prisma migrate dev` para aplicar migrações
6. Execute `npm run start:dev` para iniciar o servidor de desenvolvimento
