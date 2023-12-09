import { Class } from '../domain/Class.js'
import { Student } from '../domain/Student.js'
import { Teacher, TeacherCreationSchema, TeacherUpdateSchema } from '../domain/Teacher.js'
import { ClassService } from '../services/ClassService.js'
import { StudentService } from '../services/StudentService.js'
import { TeacherService } from '../services/TeacherService.js'
import { RouteList } from './lib/router.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function teacherRouterFactory(
  teacherService: TeacherService,
  studentService: StudentService,
  classService: ClassService,
) {
  const router: RouteList = new Map()

  router.set('GET /teachers/:id', async (req, res) => {
    const { id } = req.params
    const teacher = teacherService.findById(id)
    res.json(teacher.toObject())
  })

  router.set('GET /teachers', async (_, res) => {
    const teachers = teacherService.list() as Teacher[] // FIXME: Como melhorar?
    res.json(teachers.map((teacher: Teacher) => teacher.toObject()))
  })

  router.set('POST /teachers', async (req, res) => {
    const body = zodValidationMiddleware(TeacherCreationSchema.omit({ id: true }), await req.body())
    const teacher = teacherService.create(body)
    res.status(201).json(teacher.toObject())
  })

  router.set('PUT /teachers/:id', async (req, res) => {
    const body = zodValidationMiddleware(TeacherUpdateSchema, await req.body())
    const { id } = req.params
    const updated = teacherService.update(id, body)
    res.json(updated.toObject())
  })

  router.set('DELETE /teachers/:id', async (req, res) => {
    const classes = classService.listBy('teacher', req.params.id)

    for (const classEntity of classes) {
      classService.update(classEntity.id, { teacher: null })
    }

    res.status(204).json(teacherService.remove(req.params.id))
  })

  router.set('GET /teachers/:id/students', async (req, res) => {
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
  })

  router.set('GET /teachers/:id/classes', async (req, res) => {
    const { id } = req.params
    teacherService.findById(id)
    return res.json((classService.listBy('teacher', id) as Class[]).map((classEntity: Class) => classEntity.toObject())) // FIXME: Como melhorar?
  })

  return router
}
