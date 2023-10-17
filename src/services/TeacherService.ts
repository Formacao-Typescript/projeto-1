import { ConflictError } from '../domain/Errors/Conflict.js'
import { Teacher, TeacherCreationType } from '../domain/Teacher.js'
import { Service } from './BaseService.js'

export class TeacherService extends Service {
  update(id: string, newData: Partial<Omit<TeacherCreationType, 'id'>>): Teacher {
    const entity = this.findById(id) as Teacher // FIXME: Como melhorar?
    const updated = new Teacher({
      ...entity.toObject(),
      ...newData
    })
    this.repository.save(updated)
    return updated
  }

  create(creationData: TeacherCreationType): Teacher {
    const existing = this.repository.listBy('document', creationData.document)
    if (existing.length > 0) {
      throw new ConflictError(creationData.document, Teacher)
    }
    const entity = new Teacher(creationData)
    this.repository.save(entity)
    return entity
  }
}
