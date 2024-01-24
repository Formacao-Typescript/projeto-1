import { Db } from 'mongodb'
import { Student } from '../domain/Student.js'
import { Database } from './Db.js'

export class StudentRepository extends Database {
  constructor(connection: Db) {
    super(connection, Student)
  }
}
