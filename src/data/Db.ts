import { Collection, Db, ObjectId } from 'mongodb'
import type { Serializable, SerializableStatic } from '../domain/types.js'

export abstract class Database {
  readonly dbEntity: SerializableStatic
  readonly db: Collection

  constructor(connection: Db, entity: SerializableStatic) {
    this.db = connection.collection(entity.collection)
    this.dbEntity = entity
  }

  async findById(id: string) {
    const document = await this.db.findOne({ id })
    if (!document) return null
    return this.dbEntity.fromObject(document)
  }

  // FIXME: Conseguimos deixar esse método mais genérico?
  async listBy(property: string, value: any) {
    const query = { [property]: value }
    if (Array.isArray(value)) {
      query[property] = { $in: value }
    }
    const documents = await this.db.find(query).toArray()
    return documents.map((document) => this.dbEntity.fromObject(document))
  }

  async list() {
    const documents = await this.db.find().toArray()

    console.log(documents)
    return documents.map<Serializable>((document) => this.dbEntity.fromObject(document))
  }

  async remove(id: string) {
    return this.db.deleteOne({ id })
  }

  async save(entity: Serializable) {
    console.log(entity.toObject())
    return this.db.replaceOne({ id: entity.id }, entity.toObject(), { upsert: true })
  }
}
