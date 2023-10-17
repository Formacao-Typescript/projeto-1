import { Database } from '../data/Db.js'
import { Class, ClassCreationType } from '../domain/Class.js'
import { ConflictError } from '../domain/Errors/Conflict.js'
import { DependencyConflictError } from '../domain/Errors/DependencyConflict.js'
import { MissingDependencyError } from '../domain/Errors/DependencyNotFound.js'
import { NotFoundError } from '../domain/Errors/NotFound.js'
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
  update(id: string, newData: Partial<Omit<ClassCreationType, 'id'>>): Class {
    const entity = this.findById(id) as Class // FIXME: Como melhorar?
    if (newData.teacher) {
      try {
        this.teacherService.findById(newData.teacher)
      } catch (err) {
        throw new NotFoundError(newData.teacher, Teacher)
      }
    }

    const updated = new Class({
      ...entity.toObject(),
      ...newData
    })
    this.repository.save(updated)
    return updated
  }

  create(creationData: ClassCreationType): Class {
    const existing = this.repository.listBy('code', creationData.code)
    if (existing.length > 0) {
      throw new ConflictError(creationData.code, Class)
    }

    if (creationData.teacher) {
      try {
        this.teacherService.findById(creationData.teacher)
      } catch (err) {
        throw new NotFoundError(creationData.teacher, Teacher)
      }
    }

    const entity = new Class(creationData)
    this.repository.save(entity)
    return entity
  }

  remove(id: string): void {
    const students = this.studentService.listBy('class', id)
    if (students.length > 0) {
      throw new DependencyConflictError(Class, id, Student)
    }
    this.repository.remove(id)
  }

  getTeacher(classId: string) {
    const classEntity = this.findById(classId) as Class // FIXME: Como melhorar?
    if (!classEntity.teacher) throw new MissingDependencyError(Teacher, classEntity.id, Class)
    const teacher = this.teacherService.findById(classEntity.teacher)
    return teacher
  }

  getStudents(classId: string) {
    const classEntity = this.findById(classId)
    return this.studentService.listBy('class', classEntity.id)
  }
}
