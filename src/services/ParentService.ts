import { ConflictError } from '../domain/Errors/Conflict.js'
import { Parent, ParentCreationType, ParentUpdateType } from '../domain/Parent.js'
import { Service } from './BaseService.js'

export class ParentService extends Service {
  async update(id: string, newData: ParentUpdateType) {
    const entity = (await this.findById(id)) as Parent // FIXME: Como melhorar?
    const updated = new Parent({
      ...entity.toObject(),
      ...newData
    })
    await this.repository.save(updated)
    return updated
  }

  async create(creationData: ParentCreationType) {
    const existing = await this.repository.listBy('document', creationData.document)
    if (existing.length > 0) {
      throw new ConflictError(creationData.document, Parent)
    }
    const entity = new Parent(creationData)
    await this.repository.save(entity)
    return entity
  }
}
