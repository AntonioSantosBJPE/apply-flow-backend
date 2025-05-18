import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3333),
  ENABLE_SWAGGER: z.string().optional().default('FALSE'),
});

export type Env = z.infer<typeof envSchema>;
