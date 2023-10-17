import { Student } from '../domain/Student.js'
import { Database } from './Db.js'

export class StudentRepository extends Database {
  constructor() {
    super(Student)
  }
}
