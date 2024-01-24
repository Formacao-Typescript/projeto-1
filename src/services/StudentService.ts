import { Database } from '../data/Db.js'
import { ConflictError } from '../domain/Errors/Conflict.js'
import { Parent } from '../domain/Parent.js'
import { Student, StudentCreationType, StudentUpdateType } from '../domain/Student.js'
import { Service } from './BaseService.js'
import { ParentService } from './ParentService.js'

export class StudentService extends Service {
  constructor(repository: Database, private readonly parentService: ParentService) {
    super(repository)
  }

  async update(id: string, newData: StudentUpdateType) {
    const entity = (await this.findById(id)) as Student // FIXME: Como melhorar?
    const updated = new Student({
      ...entity.toObject(),
      ...newData
    })
    await this.repository.save(updated)
    return updated
  }

  async create(creationData: StudentCreationType) {
    const existing = await this.repository.listBy('document', creationData.document)
    if (existing.length > 0) {
      throw new ConflictError(creationData.document, Student)
    }

    for (const parentId of creationData.parents) {
      await this.parentService.findById(parentId)
    }
    const entity = new Student(creationData)
    await this.repository.save(entity)
    return entity
  }

  async getParents(studentId: string) {
    const student = (await this.findById(studentId)) as Student // FIXME: Como melhorar?
    const parents = await Promise.all(
      student.parents.map<Promise<Parent>>(async (parentId: string) => await this.parentService.findById(parentId))
    )
    return parents
  }

  async linkParents(id: string, parentsToUpdate: StudentCreationType['parents']) {
    const student = (await this.findById(id)) as Student // FIXME: Como melhorar?
    for (const parentId of parentsToUpdate) {
      await this.parentService.findById(parentId)
    }

    student.parents = parentsToUpdate
    await this.repository.save(student)
    return student
  }
}
