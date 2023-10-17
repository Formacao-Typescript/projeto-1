import { SerializableStatic } from '../types.js'
import { DomainError } from './DomainError.js'

export class MissingDependencyError extends DomainError {
  constructor(searched: SerializableStatic, locator: any, dependent: SerializableStatic) {
    super(`${searched.name} could not be found in ${dependent.name} with locator ${locator}`, searched, {
      code: 'DEPENDENCY_LOCK',
      status: 404
    })
  }
}
