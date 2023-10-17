import { Request, Router } from 'express'
import {
  Teacher,
  TeacherCreationSchema,
  TeacherCreationType,
  TeacherUpdateSchema,
  TeacherUpdateType
} from '../domain/Teacher.js'
import { ClassService } from '../services/ClassService.js'
import { StudentService } from '../services/StudentService.js'
import { TeacherService } from '../services/TeacherService.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'
import { Student } from '../domain/Student.js'
import { Class } from '../domain/Class.js'

export function teacherRouterFactory(
  teacherService: TeacherService,
  studentService: StudentService,
  classService: ClassService
) {
  const router = Router()

  router.get('/:id', async (req, res, next) => {
    const { id } = req.params
    try {
      const teacher = teacherService.findById(id)
      res.json(teacher.toObject())
    } catch (err) {
      next(err)
    }
  })

  router.get('/', async (_, res) => {
    const teachers = teacherService.list() as Teacher[] // FIXME: Como melhorar?
    res.json(teachers.map((teacher: Teacher) => teacher.toObject()))
  })

  router.post(
    '/',
    zodValidationMiddleware(TeacherCreationSchema.omit({ id: true })),
    async (req: Request<never, any, Omit<TeacherCreationType, 'id'>>, res, next) => {
      try {
        const teacher = teacherService.create(req.body)
        res.status(201).json(teacher.toObject())
      } catch (error) {
        next(error)
      }
    }
  )

  router.put(
    '/:id',
    zodValidationMiddleware(TeacherUpdateSchema),
    async (req: Request<{ id: string }, any, TeacherUpdateType>, res, next) => {
      try {
        const { id } = req.params
        const updated = teacherService.update(id, req.body)
        res.json(updated.toObject())
      } catch (error) {
        next(error)
      }
    }
  )

  router.delete('/:id', async (req, res) => {
    const classes = classService.listBy('teacher', req.params.id)

    for (const classEntity of classes) {
      classService.update(classEntity.id, { teacher: null })
    }

    res.status(204).json(teacherService.remove(req.params.id))
  })

  router.get('/:id/students', async (req, res, next) => {
    try {
      const { id } = req.params
      teacherService.findById(id)

      const classes = classService.listBy('teacher', id)
      if (classes.length === 0) {
        return res.json([])
      }

      let totalStudents: Student[] = []
      for (const classEntity of classes) {
        const students = studentService.listBy('class', classEntity.id) as Student[] // FIXME: Como melhorar?
        totalStudents = [...totalStudents, ...students]
      }

      res.json(totalStudents.map((student) => student.toObject()))
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id/classes', async (req, res, next) => {
    try {
      const { id } = req.params
      teacherService.findById(id)
      return res.json(
        (classService.listBy('teacher', id) as Class[]).map((classEntity: Class) => classEntity.toObject())
      ) // FIXME: Como melhorar?
    } catch (error) {
      next(error)
    }
  })

  return router
}
