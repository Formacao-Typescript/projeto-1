import { ServiceList } from '../../../app.js'
import type { ParentService } from '../../../services/ParentService.js'
import { createParentHandler } from './parent/create.js'
import { deleteParentHandler } from './parent/delete.js'
import { findParentHandler } from './parent/find.js'
import { listParentHandler } from './parent/list.js'

export function subcommandHandler(
  services: ServiceList,
  entity: keyof ServiceList,
  subcommand: string,
  options?: { id?: string }
) {
  const service = services[entity]

  switch (subcommand) {
    case 'create':
      createParentHandler(service as ParentService)
      break
    case 'delete':
      deleteParentHandler(service as ParentService, options?.id)
      break
    case 'list':
      listParentHandler(service as ParentService)
      break
    case 'find':
      findParentHandler(service as ParentService, options?.id)
      break
    default:
      return console.log('Subcommand not found')
  }
}
