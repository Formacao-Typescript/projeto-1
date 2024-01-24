import { Database } from '../data/Db.js'
import { NotFoundError } from '../domain/Errors/NotFound.js'
import { Serializable } from '../domain/types.js'

export abstract class Service {
  constructor(protected repository: Database) {}

  async findById(id: string) {
    const entity = await this.repository.findById(id)
    if (!entity) throw new NotFoundError(id, this.repository.dbEntity)
    return entity
  }

  async list() {
    return this.repository.list()
  }

  // FIXME: Como melhorar?
  async listBy(property: string, value: any) {
    const entity = await this.repository.listBy(property, value)
    return entity
  }

  async remove(id: string) {
    await this.repository.remove(id)
    return
  }

  // FIXME: Como melhorar?
  abstract update(id: string, newData: unknown): Promise<Serializable>
  abstract create(creationData: unknown): Promise<Serializable>
}
