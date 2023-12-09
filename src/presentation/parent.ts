import { Parent, ParentCreationSchema, ParentUpdateSchema } from '../domain/Parent.js'
import { Student } from '../domain/Student.js'
import { ParentService } from '../services/ParentService.js'
import { StudentService } from '../services/StudentService.js'
import { RouteList } from './lib/router.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function parentRouterFactory(parentService: ParentService, studentService: StudentService) {
  const router: RouteList = new Map()

  router.set('GET /parents/:id', async (req, res) => {
    return res.json(parentService.findById(req.params.id).toObject())
  })

  router.set('GET /parents', async (_, res) => {
    return res.json((parentService.list() as Parent[]).map((parent: Parent) => parent.toObject()))
  })

  router.set('POST /parents', async (req, res) => {
    const body = zodValidationMiddleware(ParentCreationSchema.omit({ id: true }), await req.body())
    const parent = parentService.create(body)
    return res.status(201).json(parent.toObject())
  })

  router.set('PUT /parents/:id', async (req, res) => {
    const body = zodValidationMiddleware(ParentUpdateSchema, await req.body())
    const { id } = req.params
    const updated = parentService.update(id, body)
    return res.json(updated.toObject())
  })

  router.set('DELETE /parents/:id', async (req, res) => {
    const { id } = req.params
    const students = studentService.listBy('parents', [id])
    if (students.length > 0) {
      return res.status(403).json({
        message: `Cannot delete parent with id ${id} because it has students assigned`,
      })
    }

    parentService.remove(id)
    return void res.status(204).end()
  })

  router.set('GET /parents/:id/students', async (req, res) => {
    const { id } = req.params
    const students = studentService.listBy('parents', [id]) as Student[] // FIXME: Como melhorar?
    return res.json(students.map((student: Student) => student.toObject()))
  })

  return router
}
