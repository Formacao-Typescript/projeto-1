import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { Parent } from '../domain/Parent.js'
import { Student, StudentCreationSchema, StudentUpdateSchema } from '../domain/Student.js'
import { ClassService } from '../services/ClassService.js'
import { StudentService } from '../services/StudentService.js'
import { onlyIdParamSchema } from './index.js'

export function studentRouterFactory(studentService: StudentService, classService: ClassService) {
  return (fastifyInstance: FastifyInstance, _: FastifyPluginOptions, done: (err?: Error) => void) => {
    const router = fastifyInstance.withTypeProvider<ZodTypeProvider>()

    router.get('/:id', onlyIdParamSchema, async (req, res) => {
      const student = studentService.findById(req.params.id)
      return res.send(student.toObject())
    })

    router.get('/', async (_, res) => {
      return res.send((studentService.list() as Student[]).map((student: Student) => student.toObject())) // FIXME: Como melhorar?
    })

    router.post('/', { schema: { body: StudentCreationSchema.omit({ id: true }) } }, async (req, res) => {
      const student = studentService.create(req.body)
      // verifica se a classe existe antes de inserir o objeto
      classService.findById(req.body.class)
      return res.status(201).send(student.toObject())
    })

    router.put(
      '/:id',
      { schema: { body: StudentUpdateSchema, params: onlyIdParamSchema.schema.params } },
      async (req, res) => {
        const { id } = req.params
        const updated = studentService.update(id, req.body)
        return res.send(updated.toObject())
      }
    )

    router.delete('/:id', onlyIdParamSchema, async (req, res) => {
      studentService.remove(req.params.id)
      return res.status(204).send()
    })

    router.get('/:id/parents', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const parents = studentService.getParents(id) as Parent[] // FIXME: Como melhorar?
      return res.send(parents.map((parent: Parent) => parent.toObject()))
    })

    router.patch(
      '/:id/parents',
      { schema: { body: StudentCreationSchema.pick({ parents: true }), params: onlyIdParamSchema.schema.params } },
      async (req, res) => {
        const { id } = req.params
        const { parents } = req.body
        return res.send(studentService.linkParents(id, parents).toObject())
      }
    )

    done()
  }
}
