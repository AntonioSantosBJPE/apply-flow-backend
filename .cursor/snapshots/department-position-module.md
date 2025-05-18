# Organização dos Módulos de Departamento e Posição

## Módulo de Departamento

O módulo de Departamento é responsável por gerenciar departamentos e suas permissões associadas.

### Controladores e Repositórios

- Todos os controladores de departamento devem ser registrados no `DepartmentModule`
- Controlador principal em `src/infra/http/controllers/department/department.controller.ts`
- Repositório de interface em `src/domain/department/repositories/department-repository.ts`
- Implementação do repositório em `src/infra/database/prisma/repositories/prisma-department-repository.ts`

### Casos de Uso

Os casos de uso para gerenciamento de departamentos devem incluir:

- **CreateDepartmentUseCase**: Criar um novo departamento
- **UpdateDepartmentUseCase**: Atualizar informações de um departamento
- **FindDepartmentByIdUseCase**: Buscar departamento por ID
- **DeleteDepartmentUseCase**: Remover departamento
- **ListDepartmentsUseCase**: Listar todos os departamentos
- **AssignPermissionToDepartmentUseCase**: Atribuir permissão a um departamento
- **RemovePermissionFromDepartmentUseCase**: Remover permissão de um departamento
- **ListDepartmentPermissionsUseCase**: Listar permissões de um departamento

### Organização do Módulo

```typescript
@Module({
  imports: [DependenciesModule],
  controllers: [
    DepartmentController,
    DepartmentPermissionController,
  ],
  providers: [
    // Use cases
    CreateDepartmentUseCase,
    UpdateDepartmentUseCase,
    FindDepartmentByIdUseCase,
    DeleteDepartmentUseCase,
    ListDepartmentsUseCase,
    AssignPermissionToDepartmentUseCase,
    RemovePermissionFromDepartmentUseCase,
    ListDepartmentPermissionsUseCase,
  ],
})
export class DepartmentModule {}
```

## Módulo de Posição (Cargo)

O módulo de Posição gerencia cargos dentro dos departamentos e suas permissões.

### Controladores e Repositórios

- Todos os controladores de posição devem ser registrados no `PositionModule`
- Controlador principal em `src/infra/http/controllers/position/position.controller.ts`
- Repositório de interface em `src/domain/position/repositories/position-repository.ts`
- Implementação do repositório em `src/infra/database/prisma/repositories/prisma-position-repository.ts`

### Casos de Uso

Os casos de uso para gerenciamento de posições (cargos) devem incluir:

- **CreatePositionUseCase**: Criar um novo cargo
- **UpdatePositionUseCase**: Atualizar informações de um cargo
- **FindPositionByIdUseCase**: Buscar cargo por ID
- **DeletePositionUseCase**: Remover cargo
- **ListPositionsUseCase**: Listar todos os cargos
- **ListPositionsByDepartmentUseCase**: Listar cargos por departamento
- **AssignPermissionToPositionUseCase**: Atribuir permissão a um cargo
- **RemovePermissionFromPositionUseCase**: Remover permissão de um cargo
- **ListPositionPermissionsUseCase**: Listar permissões de um cargo

### Organização do Módulo

```typescript
@Module({
  imports: [DependenciesModule],
  controllers: [
    PositionController,
    PositionPermissionController,
  ],
  providers: [
    // Use cases
    CreatePositionUseCase,
    UpdatePositionUseCase,
    FindPositionByIdUseCase,
    DeletePositionUseCase,
    ListPositionsUseCase,
    ListPositionsByDepartmentUseCase,
    AssignPermissionToPositionUseCase,
    RemovePermissionFromPositionUseCase,
    ListPositionPermissionsUseCase,
  ],
})
export class PositionModule {}
```

## Registro nos Módulos HTTP

Os módulos de domínio devem ser registrados no `HttpModule`:

```typescript
@Module({
  imports: [
    // Outros módulos...
    DepartmentModule,
    PositionModule,
  ],
  // ...
})
export class HttpModule {} 