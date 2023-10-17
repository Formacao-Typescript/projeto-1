import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import type { Serializable, SerializableStatic } from '../domain/types.js'
import { fileURLToPath } from 'url'

/**
 * Fazemos dessa classe uma classe abstrata para que a gente sempre precise
 * criar uma classe específica para cada entidade que queremos persistir
 * e evitar o uso de new Database(Parent) no entrypoint
 * Será que conseguimos deixar ela ainda mais genérica?
 */
export abstract class Database {
  protected readonly dbPath: string
  protected dbData: Map<string, Serializable> = new Map()
  readonly dbEntity: SerializableStatic

  // FIXME: Como melhorar?
  constructor(entity: SerializableStatic) {
    this.dbPath = resolve(dirname(fileURLToPath(import.meta.url)), `.data/${entity.name.toLowerCase()}.json`)
    this.dbEntity = entity
    this.#initialize()
  }

  #initialize() {
    if (!existsSync(dirname(this.dbPath))) {
      mkdirSync(dirname(this.dbPath), { recursive: true })
    }
    if (existsSync(this.dbPath)) {
      const data: [string, Record<string, unknown>][] = JSON.parse(readFileSync(this.dbPath, 'utf-8'))
      for (const [key, value] of data) {
        this.dbData.set(key, this.dbEntity.fromObject(value))
      }
      return
    }
    this.#updateFile()
  }

  #updateFile() {
    const data = [...this.dbData.entries()].map(([key, value]) => [key, value.toObject()])
    writeFileSync(this.dbPath, JSON.stringify(data))
    return this
  }

  findById(id: string) {
    return this.dbData.get(id)
  }

  // FIXME: Conseguimos deixar esse método mais genérico?
  listBy(property: string, value: any) {
    const allData = this.list()
    return allData.filter((data) => {
      let comparable = (data as any)[property] as unknown // FIXME: Como melhorar?
      let comparison = value as unknown
      // Se a propriedade for um objeto, um array ou uma data
      // não temos como comparar usando ===
      // portanto vamos converter tudo que cair nesses casos para string
      if (typeof comparable === 'object')
        [comparable, comparison] = [JSON.stringify(comparable), JSON.stringify(comparison)]

      // Ai podemos comparar os dois dados
      return comparable === comparison
    })
  }

  // FIXME: Como melhorar?
  list(): Serializable[] {
    return [...this.dbData.values()]
  }

  remove(id: string) {
    this.dbData.delete(id)
    return this.#updateFile()
  }

  // FIXME: Como melhorar?
  save(entity: Serializable) {
    this.dbData.set(entity.id, entity)
    return this.#updateFile()
  }
}
