import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { AddressSchema, Serializable } from './types.js'

export const ParentCreationSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string(),
  surname: z.string(),
  phones: z.array(z.string()).nonempty(),
  emails: z.array(z.string().email()).nonempty(),
  address: z.array(AddressSchema).nonempty(),
  document: z.string()
})

export const ParentUpdateSchema = ParentCreationSchema.partial().omit({ id: true })

export type ParentCreationType = z.infer<typeof ParentCreationSchema>
export type ParentUpdateType = z.infer<typeof ParentUpdateSchema>

export class Parent implements Serializable {
  firstName: ParentCreationType['firstName']
  surname: ParentCreationType['surname']
  phones: ParentCreationType['phones']
  emails: ParentCreationType['emails']
  address: ParentCreationType['address']
  document: ParentCreationType['document']
  readonly id: string

  constructor(data: ParentCreationType) {
    const parsed = ParentCreationSchema.parse(data)
    this.firstName = parsed.firstName
    this.surname = parsed.surname
    this.phones = parsed.phones
    this.emails = parsed.emails
    this.address = parsed.address
    this.document = parsed.document
    this.id = parsed.id ?? randomUUID()
  }

  static fromObject(data: Record<string, unknown>) {
    const parsed = ParentCreationSchema.parse(data)
    return new Parent(parsed)
  }

  toObject() {
    return {
      firstName: this.firstName,
      surname: this.surname,
      phones: this.phones,
      emails: this.emails,
      address: this.address,
      document: this.document,
      id: this.id
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject())
  }
}
