import { inspect } from 'util'
import { ParentService } from '../../../../services/ParentService.js'

export function listParentHandler(service: ParentService) {
  const parents = service.list()
  console.log(inspect(parents, { depth: null, colors: true }))
}
