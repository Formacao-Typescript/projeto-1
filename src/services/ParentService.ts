import { ConflictError } from '../domain/Errors/Conflict.js'
import { Parent, ParentCreationType } from '../domain/Parent.js'
import { Service } from './BaseService.js'

export class ParentService extends Service {
  update(id: string, newData: Partial<Omit<ParentCreationType, 'id'>>): Parent {
    const entity = this.findById(id) as Parent // FIXME: Como melhorar?
    const updated = new Parent({
      ...entity.toObject(),
      ...newData
    })
    this.repository.save(updated)
    return updated
  }

  create(creationData: ParentCreationType): Parent {
    const existing = this.repository.listBy('document', creationData.document)
    if (existing.length > 0) {
      throw new ConflictError(creationData.document, Parent)
    }
    const entity = new Parent(creationData)
    this.repository.save(entity)
    return entity
  }
}
