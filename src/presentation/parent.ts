import { Router } from 'express'
import { Parent, ParentCreationSchema, ParentUpdateSchema } from '../domain/Parent.js'
import { ParentService } from '../services/ParentService.js'
import { StudentService } from '../services/StudentService.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'
import { Student } from '../domain/Student.js'

export function parentRouterFactory(parentService: ParentService, studentService: StudentService) {
  const router = Router()

  router.get('/:id', async (req, res, next) => {
    try {
      return res.json(parentService.findById(req.params.id).toObject())
    } catch (error) {
      next(error)
    }
  })

  router.get('/', async (_, res) => {
    return res.json((parentService.list() as Parent[]).map((parent: Parent) => parent.toObject())) // FIXME: Como melhorar?
  })

  router.post('/', zodValidationMiddleware(ParentCreationSchema.omit({ id: true })), async (req, res, next) => {
    try {
      const parent = parentService.create(req.body)
      return res.status(201).json(parent.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.put('/:id', zodValidationMiddleware(ParentUpdateSchema), async (req, res, next) => {
    try {
      const { id } = req.params
      const updated = parentService.update(id, req.body)
      return res.json(updated.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      const students = studentService.listBy('parents', [id])
      if (students.length > 0) {
        return res.status(403).json({
          message: `Cannot delete parent with id ${id} because it has students assigned`,
        })
      }

      parentService.remove(id)
      return res.status(204).send()
    } catch (err) {
      next(err)
    }
  })

  router.get('/:id/students', async (req, res) => {
    const { id } = req.params
    const students = studentService.listBy('parents', [id]) as Student[] // FIXME: Como melhorar?
    return res.json(students.map((student: Student) => student.toObject()))
  })

  return router
}
