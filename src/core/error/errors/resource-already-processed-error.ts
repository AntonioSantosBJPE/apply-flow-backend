import { UseCaseError } from '@/core/error/use-case-error';

export class ResourceAlreadyProcessedError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string, status: string) {
    super(
      `Resource "${identifier}" has already been processed with status "${status}"`,
    );
  }
}
