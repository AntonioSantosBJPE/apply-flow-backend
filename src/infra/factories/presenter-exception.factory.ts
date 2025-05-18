import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

export class PresenterExceptionFactory {
  static create(error: unknown, context: string): HttpException {
    if (error instanceof HttpException) {
      // If it's already an HTTP exception, just return it
      return error;
    }

    if (error instanceof Error) {
      // For known errors, return a BadRequestException with the error message
      const errorResponse = {
        message: `Error processing data in ${context}.`,
        error: error.message,
        statusCode: 500,
      };

      // Log the full error details for debugging
      console.error('Presenter error details:', errorResponse);

      return new BadRequestException(errorResponse);
    }

    // For unknown errors, return an InternalServerError
    const errorResponse = {
      message: `Unexpected error in ${context}`,
      error: 'An unexpected error occurred while processing your request',
      statusCode: 500,
    };

    console.error('Presenter unknown error:', errorResponse);

    return new InternalServerErrorException(errorResponse);
  }
}
