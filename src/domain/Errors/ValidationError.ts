import { ZodError } from 'zod'

export class ValidationError extends Error {
  readonly status: number
  readonly code: string
  readonly issues: ZodError['issues']
  constructor(error: ZodError) {
    const formattedError = error.format()
    super(formattedError._errors.join('\n'))
    this.name = 'ValidationError'
    this.status = 422
    this.issues = error.issues
    this.code = 'VALIDATION_ERROR'
  }
}
