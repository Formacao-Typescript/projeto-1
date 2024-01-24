import { z } from 'zod'

export const AppConfigSchema = z
  .object({
    PORT: z
      .string()
      .optional()
      .default('3000')
      .transform((value) => Number(value))
      .refine((port) => port >= 0 && port <= 65535, { message: 'Port must be less than 65535' }),
    DB_HOST: z.string().optional().default('mongodb://localhost:27017'),
    DB_NAME: z.string().optional().default('school-api')
  })
  .strip()
export type AppConfig = z.infer<typeof AppConfigSchema>

export const appConfig: AppConfig = AppConfigSchema.parse(process.env)
