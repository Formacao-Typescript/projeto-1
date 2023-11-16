import { SerializableStatic } from '../types.js'

interface DomainErrorOptions extends ErrorOptions {
  code?: string
  status?: number
}

export abstract class DomainError extends Error {
  readonly code: string
  readonly status: number
  constructor(message: string, entity: SerializableStatic, options?: DomainErrorOptions) {
    super(message, options)
    this.name = `${entity.name}Error`
    this.stack = new Error().stack
    this.code = options?.code ?? 'DOMAIN_ERROR'
    this.status = options?.status ?? 500
  }
}
