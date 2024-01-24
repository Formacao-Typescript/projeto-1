import { Db } from 'mongodb'
import { Teacher } from '../domain/Teacher.js'
import { Database } from './Db.js'

export class TeacherRepository extends Database {
  constructor(connection: Db) {
    super(connection, Teacher)
  }
}
