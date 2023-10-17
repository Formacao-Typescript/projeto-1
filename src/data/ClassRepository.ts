import { Class } from '../domain/Class.js'
import { Database } from './Db.js'
import { TeacherRepository } from './TeacherRepository.js'

export class ClassRepository extends Database {
  constructor() {
    super(Class)
  }
}
