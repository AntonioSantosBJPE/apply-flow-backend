# Verificação de Permissões

## Visão Geral

O sistema de verificação de permissões implementa uma abordagem hierárquica combinando RBAC e ABAC, onde as permissões são verificadas em uma ordem específica de precedência.

## Hierarquia de Verificação

A verificação de permissões segue a seguinte ordem:

1. **Permissões Individuais do Usuário**
   - Verificação mais prioritária
   - Pode conceder (`is_allowed=true`) ou negar (`is_allowed=false`) explicitamente acesso
   - Substitui todas as outras permissões

2. **Permissões de Cargo**
   - Segunda na ordem de prioridade
   - Considera o cargo específico do usuário
   - Pode ser substituída por permissões individuais

3. **Permissões de Departamento**
   - Terceira na ordem de prioridade
   - Considera o departamento do usuário
   - Pode ser substituída por permissões de cargo ou individuais

4. **Permissões de Role**
   - Última na ordem de prioridade
   - Considera todas as roles atribuídas ao usuário
   - Pode ser substituída por qualquer uma das anteriores

## Implementação

A verificação de permissões deve ser implementada em um serviço dedicado:

```typescript
@Injectable()
export class PermissionVerificationService {
  constructor(
    @Inject('UserRepository')
    private userRepository: UserRepository,
    @Inject('PermissionRepository')
    private permissionRepository: PermissionRepository,
    // Outros repositórios necessários
  ) {}

  async hasPermission(userId: string, action: string, resource: string): Promise<boolean> {
    // 1. Verificar permissões explícitas do usuário
    const userPermission = await this.checkUserPermission(userId, action, resource);
    if (userPermission !== null) {
      return userPermission; // Pode ser true ou false (negação explícita)
    }

    // 2. Verificar permissões do cargo
    const positionPermission = await this.checkPositionPermission(userId, action, resource);
    if (positionPermission) {
      return true;
    }

    // 3. Verificar permissões do departamento
    const departmentPermission = await this.checkDepartmentPermission(userId, action, resource);
    if (departmentPermission) {
      return true;
    }

    // 4. Verificar permissões das roles
    const rolePermission = await this.checkRolePermission(userId, action, resource);
    return rolePermission;
  }

  // Implementação dos métodos auxiliares
}
```

## Middleware de Autorização

Um middleware de autorização pode ser implementado para proteger rotas:

```typescript
@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(
    private permissionVerificationService: PermissionVerificationService,
    private jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = this.extractToken(req);
      const payload = this.jwtService.verify(token);
      
      const userId = payload.sub;
      const action = this.getActionFromRoute(req);
      const resource = this.getResourceFromRoute(req);
      
      const hasPermission = await this.permissionVerificationService.hasPermission(
        userId,
        action,
        resource
      );
      
      if (!hasPermission) {
        throw new UnauthorizedException('Acesso não autorizado');
      }
      
      next();
    } catch (error) {
      throw new UnauthorizedException('Acesso não autorizado');
    }
  }
}
```

## Decorator de Permissão

Um decorator personalizado pode ser criado para simplificar a verificação de permissões em controladores:

```typescript
export function RequirePermission(permission: string) {
  return SetMetadata('required-permission', permission);
}
```

Esse decorator pode ser usado junto com um guard:

```typescript
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionVerificationService: PermissionVerificationService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'required-permission',
      context.getHandler(),
    );
    
    if (!requiredPermission) {
      return true; // Sem restrição de permissão
    }
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const payload = this.jwtService.verify(token);
    
    const [action, resource] = requiredPermission.split(':');
    
    return this.permissionVerificationService.hasPermission(
      payload.sub,
      action,
      resource
    );
  }
}
```

## Otimização com Cache

Para melhorar a performance, as permissões podem ser cacheadas:

```typescript
@Injectable()
export class CachedPermissionVerificationService extends PermissionVerificationService {
  constructor(
    @Inject('RedisClient')
    private redisClient: RedisClient,
    // Outros repositórios
  ) {
    super();
  }

  async hasPermission(userId: string, action: string, resource: string): Promise<boolean> {
    const cacheKey = `permission:${userId}:${action}:${resource}`;
    
    // Tentar obter do cache
    const cachedResult = await this.redisClient.get(cacheKey);
    if (cachedResult !== null) {
      return cachedResult === 'true';
    }
    
    // Verificar permissão normalmente
    const result = await super.hasPermission(userId, action, resource);
    
    // Armazenar em cache
    await this.redisClient.set(cacheKey, result.toString(), 'EX', 300); // 5 minutos
    
    return result;
  }

  async invalidateCache(userId: string): Promise<void> {
    // Lógica para invalidar cache quando permissões são modificadas
  }
}
```

## Testes

Os testes para verificação de permissões devem cobrir:

- Ordem de precedência das permissões
- Negações explícitas
- Permissões por departamento
- Permissões por cargo
- Permissões por role
- Combinações de permissões 