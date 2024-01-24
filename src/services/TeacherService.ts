import { ConflictError } from '../domain/Errors/Conflict.js'
import { Teacher, TeacherCreationType, TeacherUpdateType } from '../domain/Teacher.js'
import { Service } from './BaseService.js'

export class TeacherService extends Service {
  async update(id: string, newData: TeacherUpdateType) {
    const entity = (await this.findById(id)) as Teacher // FIXME: Como melhorar?
    const updated = new Teacher({
      ...entity.toObject(),
      ...newData
    })
    await this.repository.save(updated)
    return updated
  }

  async create(creationData: TeacherCreationType) {
    const existing = await this.repository.listBy('document', creationData.document)
    if (existing.length > 0) {
      throw new ConflictError(creationData.document, Teacher)
    }
    const entity = new Teacher(creationData)
    await this.repository.save(entity)
    return entity
  }
}
