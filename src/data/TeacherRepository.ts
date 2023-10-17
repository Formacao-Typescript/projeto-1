import { Teacher } from '../domain/Teacher.js'
import { Database } from './Db.js'

export class TeacherRepository extends Database {
  constructor() {
    super(Teacher)
  }
}
