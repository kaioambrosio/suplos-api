import { z } from 'zod'

const envSchema = z.object({
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().min(1).max(65535),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('ERRO no .env:')
  for (const i of parsed.error.issues) console.error(`  - ${i.path.join('.')}: ${i.message}`)
  throw new Error('Configuração de ambiente inválida.')
}
export const env = parsed.data
