import { SerializableStatic } from '../types.js'
import { DomainError } from './DomainError.js'

export class DependencyConflictError extends DomainError {
  constructor(entity: SerializableStatic, locator: any, dependent: SerializableStatic) {
    super(
      `${entity.name} with locator ${locator} cannot be removed because ${dependent.name} has dependencies to it`,
      entity,
      {
        code: 'DEPENDENCY_LOCK',
        status: 403
      }
    )
  }
}
