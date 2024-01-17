import { Database } from '../data/Db.js'
import { ConflictError } from '../domain/Errors/Conflict.js'
import { Parent } from '../domain/Parent.js'
import { ExtendedStudent, Student, StudentCreationType, StudentUpdateType } from '../domain/Student.js'
import { Service } from './BaseService.js'
import { ParentService } from './ParentService.js'

export class StudentService extends Service {
  constructor(repository: Database, private readonly parentService: ParentService) {
    super(repository)
  }

  update(id: string, newData: StudentUpdateType) {
    const entity = this.findById(id) as Student // FIXME: Como melhorar?
    const updated = new Student({
      ...entity.toObject(),
      ...newData
    })
    this.repository.save(updated)

    const parents = this.getParents(updated)
    return new ExtendedStudent(updated, parents)
  }

  create(creationData: StudentCreationType) {
    const existing = this.repository.listBy('document', creationData.document)
    if (existing.length > 0) {
      throw new ConflictError(creationData.document, Student)
    }
    const parents = creationData.parents.map((parentId) => this.parentService.findById(parentId)) as Parent[]
    const entity = new Student(creationData)
    this.repository.save(entity)

    return new ExtendedStudent(entity, parents)
  }

  list() {
    const entities = this.repository.list() as Student[]
    return entities.map((entity) => {
      const parents = this.getParents(entity) as Parent[]
      return new ExtendedStudent(entity, parents)
    })
  }

  getParents(idOrEntity: string | Student) {
    const student = typeof idOrEntity === 'string' ? (this.findById(idOrEntity) as Student) : (idOrEntity as Student)
    return student.parents.map((parentId: string) => this.parentService.findById(parentId)) as Parent[]
  }

  linkParents(id: string, parentsToUpdate: StudentCreationType['parents']) {
    const student = this.findById(id) as Student // FIXME: Como melhorar?
    const parents = parentsToUpdate.map((parentId) => this.parentService.findById(parentId)) as Parent[]

    student.parents = parentsToUpdate
    this.repository.save(student)
    return new ExtendedStudent(student, parents)
  }
}
