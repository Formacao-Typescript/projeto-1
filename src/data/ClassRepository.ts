import { Db } from 'mongodb'
import { Class } from '../domain/Class.js'
import { Database } from './Db.js'

export class ClassRepository extends Database {
  constructor(connection: Db) {
    super(connection, Class)
  }
}
