import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { Serializable } from './types.js'

export const StudentCreationSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string(),
  surname: z.string(),
  document: z.string(),
  bloodType: z.string(),
  birthDate: z
    .string()
    .datetime()
    // Podemos adicionar um .transform para transformar essa data em um objeto Date
    // Porém iríamos precisar estender o objeto para que ele aceite um Date
    // E aqui não seria uma boa solução
    .refine((date) => !isNaN(new Date(date).getTime())),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  startDate: z
    .string()
    .datetime()
    .refine((date) => !isNaN(new Date(date).getTime())),
  // outra forma de usar um array
  parents: z.string().uuid().array().nonempty(),
  class: z.string().uuid()
})
export type StudentCreationType = z.infer<typeof StudentCreationSchema>

export const StudentUpdateSchema = StudentCreationSchema.partial().omit({ id: true, parents: true })
export type StudentUpdateType = z.infer<typeof StudentUpdateSchema>

export class Student implements Serializable {
  firstName: StudentCreationType['firstName']
  surname: StudentCreationType['surname']
  document: StudentCreationType['document']
  bloodType: StudentCreationType['bloodType']
  birthDate: Date
  allergies: StudentCreationType['allergies']
  medications: StudentCreationType['medications']
  startDate: Date
  class: StudentCreationType['class']
  #parents: StudentCreationType['parents']
  readonly id: string

  constructor(data: StudentCreationType) {
    const parsed = StudentCreationSchema.parse(data)
    this.firstName = parsed.firstName
    this.surname = parsed.surname
    this.document = parsed.document
    this.bloodType = parsed.bloodType
    this.birthDate = new Date(parsed.birthDate)
    this.allergies = parsed.allergies
    this.medications = parsed.medications
    this.startDate = new Date(parsed.startDate)
    this.#parents = parsed.parents
    this.class = parsed.class
    this.id = parsed.id ?? randomUUID()
  }

  get parents() {
    return this.#parents
  }

  set parents(value) {
    this.#parents = value
  }

  static fromObject(data: Record<string, unknown>) {
    const parsed = StudentCreationSchema.parse(data)
    return new Student(parsed)
  }

  toObject() {
    return {
      firstName: this.firstName,
      surname: this.surname,
      document: this.document,
      bloodType: this.bloodType,
      birthDate: this.birthDate.toISOString(),
      allergies: this.allergies,
      medications: this.medications,
      startDate: this.startDate.toISOString(),
      parents: this.#parents,
      class: this.class,
      id: this.id
    }
  }

  // Podemos criar uma classe abstrata para evitar a repetição de código
  // e abstrair esse método toJSON para ela
  toJSON() {
    return JSON.stringify(this.toObject())
  }
}
