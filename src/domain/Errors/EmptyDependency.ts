import { SerializableStatic } from '../types.js'
import { DomainError } from './DomainError.js'

export class EmptyDependencyError extends DomainError {
  constructor(relation: SerializableStatic, dependent: SerializableStatic) {
    super(`${dependent.name} must have at least one ${relation.name}`, dependent, {
      code: 'EMPTY_DEPENDENCY',
      status: 403,
    })
  }
}
