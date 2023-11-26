import { Request, Router } from 'express'
import { Class, ClassCreationSchema, ClassCreationType, ClassUpdateSchema, ClassUpdateType } from '../domain/Class.js'
import { Student } from '../domain/Student.js'
import { ClassService } from '../services/ClassService.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function classRouterFactory(classService: ClassService) {
  const router = Router()

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      const classEntity = classService.findById(id)
      return res.json(classEntity.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.get('/', async (_, res) => {
    return res.json((classService.list() as Class[]).map((classEntity: Class) => classEntity.toObject())) // FIXME: Como melhorar?
  })

  router.post(
    '/',
    zodValidationMiddleware(ClassCreationSchema.omit({ id: true })),
    async (req: Request<never, any, Omit<ClassCreationType, 'id'>>, res, next) => {
      try {
        const classEntity = classService.create(req.body)
        return res.status(201).json(classEntity.toObject())
      } catch (error) {
        next(error)
      }
    },
  )

  router.put(
    '/:id',
    zodValidationMiddleware(ClassUpdateSchema),
    async (req: Request<{ id: string }, any, ClassUpdateType>, res, next) => {
      try {
        const { id } = req.params
        const updated = classService.update(id, req.body)
        return res.json(updated.toObject())
      } catch (error) {
        next(error)
      }
    },
  )

  router.delete('/:id', async (req, res, next) => {
    try {
      classService.remove(req.params.id)
      return res.status(204).send()
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id/students', async (req, res, next) => {
    try {
      const { id } = req.params
      const students = classService.getStudents(id) as Student[] // FIXME: Como melhorar?
      return res.json(students.map((student: Student) => student.toObject()))
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id/teacher', async (req, res, next) => {
    try {
      const { id } = req.params
      const teacher = classService.getTeacher(id)
      return res.json(teacher.toObject())
    } catch (error) {
      next(error)
    }
  })

  return router
}
