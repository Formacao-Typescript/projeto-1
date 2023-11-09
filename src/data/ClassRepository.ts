import { Class } from '../domain/Class.js'
import { Database } from './Db.js'

export class ClassRepository extends Database {
  constructor() {
    super(Class)
  }
}
