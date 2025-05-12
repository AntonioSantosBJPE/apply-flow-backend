# Presenter Error Handling Pattern

## Overview

Presenters são responsáveis por transformar entidades de domínio em formatos de resposta HTTP. O padrão de tratamento de erros garante que qualquer erro durante essa transformação seja capturado e retornado como uma resposta de erro HTTP adequada, em vez de um objeto vazio ou um erro não tratado.

## Implementação

### 1. BasePresenter

Todos os presenters devem estender a classe abstrata `BasePresenter`:

```typescript
// src/infra/http/presenters/base-presenter.ts
import { PresenterExceptionFactory } from '../factories/presenter-exception.factory'

export abstract class BasePresenter {
  static safeParse<T, R>(
    data: T,
    parserFn: (data: T) => R,
    context: string,
  ): R {
    try {
      // Validar se os dados de entrada são nulos ou indefinidos
      if (data === null || data === undefined) {
        throw new Error('Input data is null or undefined')
      }

      // Executar a função de transformação
      return parserFn(data)
    } catch (error) {
      console.error(
        `Error in presenter ${context} with data:`,
        JSON.stringify(
          data,
          (key, value) =>
            value !== null && typeof value === 'object' && !Array.isArray(value)
              ? Object.keys(value).length > 20
                ? '[Object]'
                : value
              : value,
          2,
        ).substring(0, 1000), // Limitar o tamanho do log
      )

      throw PresenterExceptionFactory.create(error, context)
    }
  }
}
```

### 2. PresenterExceptionFactory

Esta factory converte erros em exceções HTTP apropriadas:

```typescript
// src/infra/http/factories/presenter-exception.factory.ts
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common'

export class PresenterExceptionFactory {
  static create(error: unknown, context: string): HttpException {
    if (error instanceof HttpException) {
      // If it's already an HTTP exception, just return it
      return error
    }

    if (error instanceof Error) {
      // For known errors, return a BadRequestException with the error message
      const errorResponse = {
        message: `Error processing data in ${context}.`,
        error: error.message,
        statusCode: 500,
      }

      // Log the full error details for debugging
      console.error('Presenter error details:', errorResponse)

      return new BadRequestException(errorResponse)
    }

    // For unknown errors, return an InternalServerError
    const errorResponse = {
      message: `Unexpected error in ${context}`,
      error: 'An unexpected error occurred while processing your request',
      statusCode: 500,
    }

    console.error('Presenter unknown error:', errorResponse)

    return new InternalServerErrorException(errorResponse)
  }
}
```

### 3. Implementação do Presenter

Ao criar um presenter, siga este padrão:

```typescript
import { FindByIdWithPlanClientUserResponse } from '@/domain/client-user/application/repositories/clients-users-repository'
import { BasePresenter } from '../base-presenter'

export class ViewClientUserByTokenIdPresenter extends BasePresenter {
  static toHTTP(clientUser: FindByIdWithPlanClientUserResponse) {
    return this.safeParse(
      clientUser,
      (data) => ({
        id: data.id,
        client_id: Number(data.client_id),
        full_name: data.full_name,
        email: data.email,
        status: data.status,
        type_authentication: data.type_authentication,
        plan_name:
          data.client.subscription && data.client.subscription.length > 0
            ? data.client.subscription[0].plan_frequency.plan.name
            : null,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }),
      'ViewClientUserByTokenIdPresenter',
    )
  }
}
```

### 4. Implementação no Controller

Os controllers não precisam mais tratar erros do presenter explicitamente:

```typescript
@Controller('/client-user/view')
export class ViewClientUserByTokenIdController {
  constructor(
    private nestViewClientUserByTokenIdUseCase: NestViewClientUserByTokenIdUseCase,
  ) {}

  @Get()
  async handle(@GetToken() token: TokenDataTypeAccessClients) {
    const result = await this.nestViewClientUserByTokenIdUseCase.execute({
      id: String(token.client_user_id),
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }

    // BasePresenter handles error cases internally
    return ViewClientUserByTokenIdPresenter.toHTTP(result.value.client)
  }
}
```

## Boas Práticas

1. **Sempre estenda o BasePresenter** para todos os presenters
2. **Use safeParse()** para tratamento de erros
3. **Forneça um contexto significativo** (nome do presenter)
4. **Use optional chaining (`?.`)** e operador de coalescência nula (`??`) para acesso seguro a propriedades
5. **Verifique arrays antes de acessar índices** para evitar erros "Cannot read property of undefined"
6. **Defina tipos de retorno apropriados** para melhor segurança de tipos
7. **Use comentários para explicar transformações complexas**

## Exemplo com Propriedades Aninhadas

Para propriedades aninhadas complexas como vemos no exemplo do `ViewClientUserByTokenIdPresenter`, usamos verificações condicionais explícitas:

```typescript
plan_name:
  data.client.subscription && data.client.subscription.length > 0
    ? data.client.subscription[0].plan_frequency.plan.name
    : null,
```

Este padrão garante que:

1. Verificamos se `data.client.subscription` existe
2. Verificamos se é um array com elementos (`length > 0`)
3. Acessamos a propriedade aninhada apenas se os passos anteriores forem válidos
4. Fornecemos um valor padrão (`null`) caso as condições não sejam atendidas

## Verificação de Checklist

Antes de enviar um código que inclui um presenter, verifique:

- [ ] O presenter estende a classe BasePresenter
- [ ] É usado o método safeParse para tratamento de erros
- [ ] O nome do presenter é incluído como parâmetro de contexto
- [ ] Propriedades aninhadas são acessadas com verificação adequada de null/undefined
- [ ] Valores opcionais são tratados adequadamente com verificações null ou valores padrão
- [ ] Comentários explicam transformações complexas quando necessário
