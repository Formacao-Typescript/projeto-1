import { Class, ClassCreationSchema, ClassUpdateSchema } from '../domain/Class.js'
import { Student } from '../domain/Student.js'
import { ClassService } from '../services/ClassService.js'
import { Router } from './lib/Router.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function classRouterFactory(classService: ClassService) {
  const router = new Router('/classes')

  router.get('/:id', async (req, res) => {
    const { id } = req.params
    const classEntity = classService.findById(id)
    return res.json(classEntity.toObject())
  })

  router.get('/', async (_, res) => {
    return res.json((classService.list() as Class[]).map((classEntity: Class) => classEntity.toObject())) // FIXME: Como melhorar?
  })

  router.post('/', async (req, res) => {
    const body = zodValidationMiddleware(ClassCreationSchema.omit({ id: true }), await req.body())
    const classEntity = classService.create(body)
    return res.status(201).json(classEntity.toObject())
  })

  router.put('/:id', async (req, res) => {
    const body = zodValidationMiddleware(ClassUpdateSchema, await req.body())
    const { id } = req.params
    const updated = classService.update(id, body)
    return res.json(updated.toObject())
  })

  router.delete('/:id', async (req, res) => {
    classService.remove(req.params.id)
    res.status(204).end()
  })

  router.get('/:id/students', async (req, res) => {
    const { id } = req.params
    const students = classService.getStudents(id) as Student[] // FIXME: Como melhorar?
    return res.json(students.map((student: Student) => student.toObject()))
  })

  router.get('/:id/teacher', async (req, res) => {
    const { id } = req.params
    const teacher = classService.getTeacher(id)
    return res.json(teacher.toObject())
  })

  return router
}
