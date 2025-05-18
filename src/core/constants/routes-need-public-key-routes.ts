import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { ROUTES } from './routes';
export const ROUTES_NEED_PUBLIC_KEY: RouteInfo[] = [
  {
    method: RequestMethod.POST,
    path: ROUTES.AUTH.LOGIN.URL,
  },
];
