import { ZodSchema } from 'zod'
import { ValidationError } from '../../domain/Errors/ValidationError.js'

export default <T extends ZodSchema<T['_output']>>(schema: T, toValidate: unknown) => {
  const result = schema.safeParse(toValidate)
  if (!result.success) {
    throw new ValidationError(result.error)
  }
  return result.data
}
