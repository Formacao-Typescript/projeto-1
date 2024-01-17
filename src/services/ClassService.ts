import { Database } from '../data/Db.js'
import { Class, ClassCreationType, ClassUpdateType, ExtendedClass } from '../domain/Class.js'
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

  #assertTeacherExists(teacherId?: string | null) {
    if (teacherId) this.teacherService.findById(teacherId)
  }

  update(id: string, newData: ClassUpdateType) {
    const entity = this.findById(id) as Class
    this.#assertTeacherExists(newData.teacher)

    const updated = new Class({
      ...entity.toObject(),
      ...newData
    })
    this.repository.save(updated)

    if (!updated.teacher) return new ExtendedClass(updated)

    const teacher = this.teacherService.findById(updated.teacher) as Teacher
    return new ExtendedClass(updated, teacher)
  }

  list() {
    const classes = this.repository.list() as Class[]
    return classes.map((classEntity) => {
      if (!classEntity.teacher) return new ExtendedClass(classEntity)

      const teacher = this.teacherService.findById(classEntity.teacher) as Teacher
      return new ExtendedClass(classEntity, teacher)
    })
  }

  create(creationData: ClassCreationType) {
    const existing = this.repository.listBy('code', creationData.code)
    if (existing.length > 0) throw new ConflictError(creationData.code, Class)

    this.#assertTeacherExists(creationData.teacher)

    const entity = new Class(creationData)
    this.repository.save(entity)

    if (entity.teacher) {
      const teacher = this.teacherService.findById(entity.teacher) as Teacher
      return new ExtendedClass(entity, teacher)
    }

    return new ExtendedClass(entity)
  }

  remove(id: string) {
    const students = this.studentService.listBy('class', id)
    if (students.length > 0) {
      throw new DependencyConflictError(Class, id, Student)
    }

    this.repository.remove(id)
  }

  getTeacher(classId: string) {
    const classEntity = this.findById(classId) as Class // FIXME: como melhorar?

    if (!classEntity.teacher) throw new MissingDependencyError(Teacher, classId, Class)

    const teacher = this.teacherService.findById(classEntity.teacher)
    return teacher as Teacher
  }

  getStudents(classId: string) {
    const classEntity = this.findById(classId) as Class
    return this.studentService.listBy('class', classEntity.id) as Student[]
  }
}
