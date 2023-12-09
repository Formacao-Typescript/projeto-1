import { Class, ClassCreationSchema, ClassUpdateSchema } from '../domain/Class.js'
import { Student } from '../domain/Student.js'
import { ClassService } from '../services/ClassService.js'
import { RouteList } from './lib/router.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function classRouterFactory(classService: ClassService) {
  const router: RouteList = new Map()

  router.set('GET /classes/:id', async (req, res) => {
    const { id } = req.params
    const classEntity = classService.findById(id)
    return res.json(classEntity.toObject())
  })

  router.set('GET /classes', async (_, res) => {
    return res.json((classService.list() as Class[]).map((classEntity: Class) => classEntity.toObject())) // FIXME: Como melhorar?
  })

  router.set('POST /classes', async (req, res) => {
    const body = zodValidationMiddleware(ClassCreationSchema.omit({ id: true }), await req.body())
    const classEntity = classService.create(body)
    return res.status(201).json(classEntity.toObject())
  })

  router.set('PUT /classes/:id', async (req, res) => {
    const body = zodValidationMiddleware(ClassUpdateSchema, await req.body())
    const { id } = req.params
    const updated = classService.update(id, body)
    return res.json(updated.toObject())
  })

  router.set('DELETE /classes/:id', async (req, res) => {
    classService.remove(req.params.id)
    res.status(204).end()
  })

  router.set('GET /classes/:id/students', async (req, res) => {
    const { id } = req.params
    const students = classService.getStudents(id) as Student[] // FIXME: Como melhorar?
    return res.json(students.map((student: Student) => student.toObject()))
  })

  router.set('GET /classes/:id/teacher', async (req, res) => {
    const { id } = req.params
    const teacher = classService.getTeacher(id)
    return res.json(teacher.toObject())
  })

  return router
}
