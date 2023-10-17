import { z } from 'zod'
import { Serializable } from './types.js'
import { randomUUID } from 'node:crypto'

export const ClassCreationSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().regex(/^[1-9][A-H]-[MTN]$/),
  teacher: z.string().uuid().nullable()
})
export type ClassCreationType = z.infer<typeof ClassCreationSchema>

export const ClassUpdateSchema = ClassCreationSchema.partial().omit({ id: true })
export type ClassUpdateType = z.infer<typeof ClassUpdateSchema>

export class Class implements Serializable {
  code: ClassCreationType['code']
  // Uma forma mais simples de declarar acessores
  // veja Student.ts para a outra forma na propriedade parents
  accessor teacher: ClassCreationType['teacher']
  readonly id: string

  constructor(data: ClassCreationType) {
    this.code = data.code
    this.teacher = data.teacher
    this.id = data.id ?? randomUUID()
  }
  toObject() {
    return {
      code: this.code,
      teacher: this.teacher,
      id: this.id
    }
  }

  static fromObject(data: Record<string, unknown>) {
    const parsed = ClassCreationSchema.parse(data)
    return new Class(parsed)
  }

  toJSON() {
    return JSON.stringify(this.toObject())
  }
}
