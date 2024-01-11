import { z } from 'zod'

export const AddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  zipCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1)
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
