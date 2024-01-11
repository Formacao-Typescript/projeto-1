import Enquirer from 'enquirer'
import { ParentCreationSchema, ParentCreationType } from '../../../../domain/Parent.js'
import { ParentService } from '../../../../services/ParentService.js'

export async function deleteParentHandler(service: ParentService, id?: ParentCreationType['id']) {
  let parentId: Required<ParentCreationType['id']>
  if (id) {
    parentId = id
  } else {
    const { id } = await Enquirer.prompt<{ id: string }>({
      type: 'input',
      name: 'id',
      message: 'Parent id to delete:',
      required: true,
      validate(value) {
        return ParentCreationSchema.shape.id.safeParse(value).success
      }
    })
    parentId = id
  }
  service.remove(parentId)
  console.log(`Parent with id ${parentId} deleted`)
}
