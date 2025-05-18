import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../database/prisma/prisma.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const responseBody: DefaultExceptionBody = {
      statusCode: 500,
      message: 'All Error',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      error: exception.message || 'All Error',
    };
    response.status(responseBody.statusCode).json(responseBody);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private safelySerialize(obj: any): any {
    if (!obj) return obj;

    try {
      // Convert to JSON and back to remove non-serializable properties
      return JSON.parse(JSON.stringify(obj));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // If serialization fails, return simplified object
      return {
        serializationError: true,
        message: 'Request body contained non-serializable data',
      };
    }
  }
}
