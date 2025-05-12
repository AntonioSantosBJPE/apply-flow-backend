import { UseCaseError } from '@/core/error/use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Resource "${identifier}" not found`);
  }
}
