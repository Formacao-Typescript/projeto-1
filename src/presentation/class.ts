import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ClassService } from '../services/ClassService.js'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { Class, ClassCreationSchema, ClassUpdateSchema } from '../domain/Class.js'
import { Student } from '../domain/Student.js'
import { onlyIdParamSchema } from './index.js'

export function classRouterFactory(classService: ClassService) {
  return (fastifyInstance: FastifyInstance, _: FastifyPluginOptions, done: (err?: Error) => void) => {
    const router = fastifyInstance.withTypeProvider<ZodTypeProvider>()

    router.get('/:id', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const classEntity = classService.findById(id)
      return res.send(classEntity.toObject())
    })

    router.get('/', async (_, res) => {
      return res.send((classService.list() as Class[]).map((classEntity: Class) => classEntity.toObject())) // FIXME: Como melhorar?
    })

    router.post(
      '/',
      {
        schema: {
          body: ClassCreationSchema.omit({ id: true })
        }
      },
      async (req, res) => {
        const classEntity = classService.create(req.body)
        return res.status(201).send(classEntity.toObject())
      }
    )

    router.put(
      '/:id',
      {
        schema: {
          body: ClassUpdateSchema,
          params: onlyIdParamSchema.schema.params
        }
      },
      async (req, res) => {
        const { id } = req.params
        const updated = classService.update(id, req.body)
        return res.send(updated.toObject())
      }
    )

    router.delete('/:id', onlyIdParamSchema, async (req, res) => {
      classService.remove(req.params.id)
      return res.status(204).send()
    })

    router.get('/:id/students', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const students = classService.getStudents(id) as Student[] // FIXME: Como melhorar?
      return res.send(students.map((student: Student) => student.toObject()))
    })

    router.get('/:id/teacher', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const teacher = classService.getTeacher(id)
      return res.send(teacher.toObject())
    })

    done()
  }
}
