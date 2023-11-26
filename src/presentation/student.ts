import { Router, Request } from 'express'
import {
  Student,
  StudentCreationSchema,
  StudentCreationType,
  StudentUpdateSchema,
  StudentUpdateType,
} from '../domain/Student.js'
import { StudentService } from '../services/StudentService.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'
import { Parent } from '../domain/Parent.js'
import { ClassService } from '../services/ClassService.js'

export function studentRouterFactory(studentService: StudentService, classService: ClassService) {
  const router = Router()

  router.get('/:id', async (req, res, next) => {
    try {
      const student = studentService.findById(req.params.id)
      return res.json(student.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.get('/', async (_, res) => {
    return res.json((studentService.list() as Student[]).map((student: Student) => student.toObject())) // FIXME: Como melhorar?
  })

  router.post('/', zodValidationMiddleware(StudentCreationSchema.omit({ id: true })), async (req, res, next) => {
    try {
      const student = studentService.create(req.body)
      // verifica se a classe existe antes de inserir o objeto
      classService.findById(req.body.class)
      return res.status(201).json(student.toObject())
    } catch (error) {
      next(error)
    }
  })

  router.put(
    '/:id',
    zodValidationMiddleware(StudentUpdateSchema),
    async (req: Request<{ id: string }, any, StudentUpdateType>, res, next) => {
      try {
        const { id } = req.params
        const updated = studentService.update(id, req.body)
        return res.json(updated.toObject())
      } catch (error) {
        next(error)
      }
    },
  )

  router.delete('/:id', async (req, res) => {
    studentService.remove(req.params.id)
    return res.status(204).send()
  })

  router.get('/:id/parents', async (req, res, next) => {
    try {
      const { id } = req.params
      const parents = studentService.getParents(id) as Parent[] // FIXME: Como melhorar?
      return res.json(parents.map((parent: Parent) => parent.toObject()))
    } catch (error) {
      next(error)
    }
  })

  router.patch(
    '/:id/parents',
    zodValidationMiddleware(StudentCreationSchema.pick({ parents: true })),
    async (req: Request<{ id: string }, any, Pick<StudentCreationType, 'parents'>>, res, next) => {
      try {
        const { id } = req.params
        const { parents } = req.body
        return res.json(studentService.linkParents(id, parents).toObject())
      } catch (error) {
        next(error)
      }
    },
  )

  return router
}
