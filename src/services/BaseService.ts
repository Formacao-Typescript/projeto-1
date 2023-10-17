import { Database } from '../data/Db.js'
import { NotFoundError } from '../domain/Errors/NotFound.js'
import { Serializable } from '../domain/types.js'

export abstract class Service {
  constructor(protected repository: Database) {}

  findById(id: string) {
    const entity = this.repository.findById(id)
    if (!entity) throw new NotFoundError(id, this.repository.dbEntity)
    return entity
  }

  list() {
    return this.repository.list()
  }

  // FIXME: Como melhorar?
  listBy(property: string, value: any) {
    const entity = this.repository.listBy(property, value)
    return entity
  }

  remove(id: string) {
    this.repository.remove(id)
    return
  }

  // FIXME: Como melhorar?
  abstract update(id: string, newData: unknown): Serializable
  abstract create(creationData: unknown): Serializable
}
