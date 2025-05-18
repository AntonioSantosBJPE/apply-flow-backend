/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PresenterExceptionFactory } from '../factories/presenter-exception.factory';

export abstract class BasePresenter {
  static safeParse<T, R>(
    data: T,
    parserFn: (data: T) => R,
    context: string,
  ): R {
    try {
      // Validar se os dados de entrada são nulos ou indefinidos
      if (data === null || data === undefined) {
        throw new Error('Input data is null or undefined');
      }

      // Executar a função de transformação
      return parserFn(data);
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
      );

      throw PresenterExceptionFactory.create(error, context);
    }
  }
}
