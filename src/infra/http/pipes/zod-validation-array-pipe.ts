import {
  BadRequestException,
  ParseArrayPipe,
  ParseArrayOptions,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

export class ZodValidationArrayPipe extends ParseArrayPipe {
  constructor(
    private schema: ZodSchema,
    options?: ParseArrayOptions,
  ) {
    super(options);
  }

  transform(value: string | undefined) {
    try {
      const valueArray = value ? value.split(',') : undefined;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsedValue = this.schema.parse(valueArray);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          errors: fromZodError(error).message,
        });
      }
    }
  }
}
