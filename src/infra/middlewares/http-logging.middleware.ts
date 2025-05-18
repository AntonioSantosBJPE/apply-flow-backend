import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para logar requisições HTTP para fins de segurança e auditoria
 */
@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    // Captura o tempo de início da requisição
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || 'unknown';

    // Logar informações básicas da requisição
    this.logger.log(
      `${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // Interceptar o final da requisição para logar o tempo de resposta
    res.on('finish', () => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const { statusCode } = res;

      // Logar informações de desempenho e status code da resposta
      this.logger.log(
        `${method} ${originalUrl} - Status: ${statusCode} - Response Time: ${responseTime}ms`,
      );

      // Logar especificamente respostas de erro para análise de segurança
      if (statusCode >= 400) {
        this.logger.warn(
          `Error Response: ${method} ${originalUrl} - Status: ${statusCode} - IP: ${ip}`,
        );

        // Logar tentativas de acesso não autorizado (pode indicar tentativas de invasão)
        if (statusCode === 401 || statusCode === 403) {
          this.logger.warn(
            `SECURITY: Unauthorized attempt - ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
          );
        }
      }
    });

    next();
  }
}
