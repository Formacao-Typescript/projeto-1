import { SerializableStatic } from '../types.js'
import { DomainError } from './DomainError.js'

export class ConflictError extends DomainError {
  constructor(locator: any, entity: SerializableStatic) {
    super(`${entity.name} with locator ${JSON.stringify(locator)} already exists`, entity, {
      code: 'CONFLICT',
      status: 409
    })
  }
}
