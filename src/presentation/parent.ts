import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { Parent, ParentCreationSchema, ParentUpdateSchema } from '../domain/Parent.js'
import { Student } from '../domain/Student.js'
import { ParentService } from '../services/ParentService.js'
import { StudentService } from '../services/StudentService.js'
import { onlyIdParamSchema } from './index.js'

export function parentRouterFactory(parentService: ParentService, studentService: StudentService) {
  return (fastifyInstance: FastifyInstance, _: FastifyPluginOptions, done: (err?: Error) => void) => {
    const router = fastifyInstance.withTypeProvider<ZodTypeProvider>()

    router.get('/:id', onlyIdParamSchema, async (req, res) => {
      return res.send(parentService.findById(req.params.id).toObject())
    })

    router.get('/', async (_, res) => {
      return res.send((parentService.list() as Parent[]).map((parent: Parent) => parent.toObject())) // FIXME: Como melhorar?
    })

    router.post('/', { schema: { body: ParentCreationSchema.omit({ id: true }) } }, async (req, res) => {
      const parent = parentService.create(req.body)
      return res.status(201).send(parent.toObject())
    })

    router.put(
      '/:id',
      { schema: { body: ParentUpdateSchema, params: onlyIdParamSchema.schema.params } },
      async (req, res) => {
        const { id } = req.params
        const updated = parentService.update(id, req.body)
        return res.send(updated.toObject())
      }
    )

    router.delete('/:id', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const students = studentService.listBy('parents', [id])
      if (students.length > 0) {
        return res.status(403).send({
          message: `Cannot delete parent with id ${id} because it has students assigned`
        })
      }

      parentService.remove(id)
      return res.status(204).send()
    })

    router.get('/:id/students', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const students = studentService.listBy('parents', [id]) as Student[] // FIXME: Como melhorar?
      return res.send(students.map((student: Student) => student.toObject()))
    })

    done()
  }
}
