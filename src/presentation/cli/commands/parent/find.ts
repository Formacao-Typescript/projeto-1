import Enquirer from 'enquirer'
import { ParentCreationSchema, ParentCreationType } from '../../../../domain/Parent.js'
import { ParentService } from '../../../../services/ParentService.js'
import { inspect } from 'util'

export async function findParentHandler(service: ParentService, id?: string) {
  let parentId: Required<ParentCreationType['id']>
  if (id) {
    parentId = id
  } else {
    const { id } = await Enquirer.prompt<{ id: string }>({
      type: 'input',
      name: 'id',
      message: 'Parent id:',
      required: true,
      validate(value) {
        return ParentCreationSchema.shape.id.safeParse(value).success
      }
    })
    parentId = id
  }

  try {
    const parent = service.findById(parentId)
    console.log(inspect(parent, { depth: null, colors: true }))
  } catch (err) {
    console.error((err as Error).message)
  }
}
