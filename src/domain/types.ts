import { z } from 'zod'

export const AddressSchema = z.object({
  line1: z.string(),
  line2: z.string().optional(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string()
})
export type Address = z.infer<typeof AddressSchema>

export interface SerializableStatic {
  new (...args: any[]): any
  fromObject(data: Record<string, unknown>): InstanceType<this>
}

export interface Serializable {
  id: string
  toJSON(): string
  toObject(): Record<string, unknown>
}
