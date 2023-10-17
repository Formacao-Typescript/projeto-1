import { Parent } from '../domain/Parent.js'
import { Database } from './Db.js'

/**
 * Essa classe poderia ser instanciada diretamente no entrypoint como new Database(Parent)
 * mas como a gente sempre define os repositórios caso precisemos de mais métodos
 * é melhor sempre criar uma classe específica, por isso fizemos Database abstrata
 */
export class ParentRepository extends Database {
  constructor() {
    super(Parent)
  }
}
