import { Database } from '../data/Db.js'
import { Class, ClassCreationType, ClassUpdateType } from '../domain/Class.js'
import { ConflictError } from '../domain/Errors/Conflict.js'
import { DependencyConflictError } from '../domain/Errors/DependencyConflict.js'
import { MissingDependencyError } from '../domain/Errors/MissingDependency.js'
import { Student } from '../domain/Student.js'
import { Teacher } from '../domain/Teacher.js'
import { Service } from './BaseService.js'
import { StudentService } from './StudentService.js'
import { TeacherService } from './TeacherService.js'

export class ClassService extends Service {
  constructor(
    repository: Database,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService
  ) {
    super(repository)
  }

  async #assertTeacherExists(teacherId?: string | null) {
    if (teacherId) {
      await this.teacherService.findById(teacherId)
    }
  }

  async update(id: string, newData: ClassUpdateType) {
    const entity = (await this.findById(id)) as Class
    this.#assertTeacherExists(newData.teacher)

    const updated = new Class({
      ...entity.toObject(),
      ...newData
    })
    await this.repository.save(updated)
    return updated
  }

  async create(creationData: ClassCreationType) {
    const existing = await this.repository.listBy('code', creationData.code)
    if (existing.length > 0) throw new ConflictError(creationData.code, Class)

    await this.#assertTeacherExists(creationData.teacher)

    const entity = new Class(creationData)
    await this.repository.save(entity)
    return entity
  }

  async remove(id: string) {
    const students = await this.studentService.listBy('class', id)
    if (students.length > 0) {
      throw new DependencyConflictError(Class, id, Student)
    }

    await this.repository.remove(id)
  }

  async getTeacher(classId: string) {
    const classEntity = (await this.findById(classId)) as Class // FIXME: como melhorar?

    if (!classEntity.teacher) throw new MissingDependencyError(Teacher, classId, Class)

    const teacher = await this.teacherService.findById(classEntity.teacher)
    return teacher as Teacher
  }

  async getStudents(classId: string) {
    const classEntity = (await this.findById(classId)) as Class
    return this.studentService.listBy('class', classEntity.id) as Promise<Student[]>
  }
}
