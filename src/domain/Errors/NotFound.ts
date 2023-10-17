import { SerializableStatic } from '../types.js'
import { DomainError } from './DomainError.js'

export class NotFoundError extends DomainError {
  constructor(locator: any, entity: SerializableStatic) {
    super(`${entity.name} with locator ${JSON.stringify(locator)} could not be found`, entity, {
      code: 'NOT_FOUND',
      status: 404
    })
  }
}
