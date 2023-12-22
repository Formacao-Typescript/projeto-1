import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { Class } from '../domain/Class.js'
import { Student } from '../domain/Student.js'
import { Teacher, TeacherCreationSchema, TeacherUpdateSchema } from '../domain/Teacher.js'
import { ClassService } from '../services/ClassService.js'
import { StudentService } from '../services/StudentService.js'
import { TeacherService } from '../services/TeacherService.js'
import { onlyIdParamSchema } from './index.js'

export function teacherRouterFactory(
  teacherService: TeacherService,
  studentService: StudentService,
  classService: ClassService
) {
  return (fastifyInstance: FastifyInstance, _: FastifyPluginOptions, done: (err?: Error) => void) => {
    const router = fastifyInstance.withTypeProvider<ZodTypeProvider>()

    router.get('/:id', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      const teacher = teacherService.findById(id)
      res.send(teacher.toObject())
    })

    router.get('/', async (_, res) => {
      const teachers = teacherService.list() as Teacher[] // FIXME: Como melhorar?
      res.send(teachers.map((teacher: Teacher) => teacher.toObject()))
    })

    router.post(
      '/',
      {
        schema: {
          body: TeacherCreationSchema.omit({ id: true })
        }
      },
      async (req, res) => {
        const teacher = teacherService.create(req.body)
        res.status(201).send(teacher.toObject())
      }
    )

    router.put(
      '/:id',
      { schema: { body: TeacherUpdateSchema, params: onlyIdParamSchema.schema.params } },
      async (req, res) => {
        const { id } = req.params
        const updated = teacherService.update(id, req.body)
        res.send(updated.toObject())
      }
    )

    router.delete('/:id', onlyIdParamSchema, async (req, res) => {
      const classes = classService.listBy('teacher', req.params.id)

      for (const classEntity of classes) {
        classService.update(classEntity.id, { teacher: null })
      }

      res.status(204).send(teacherService.remove(req.params.id))
    })

    router.get('/:id/students', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      teacherService.findById(id)

      const classes = classService.listBy('teacher', id)
      if (classes.length === 0) {
        return res.send([])
      }

      let totalStudents: Student[] = []
      for (const classEntity of classes) {
        const students = studentService.listBy('class', classEntity.id) as Student[] // FIXME: Como melhorar?
        totalStudents = [...totalStudents, ...students]
      }

      res.send(totalStudents.map((student) => student.toObject()))
    })

    router.get('/:id/classes', onlyIdParamSchema, async (req, res) => {
      const { id } = req.params
      teacherService.findById(id)
      return res.send(
        (classService.listBy('teacher', id) as Class[]).map((classEntity: Class) => classEntity.toObject())
      ) // FIXME: Como melhorar?
    })

    done()
  }
}
