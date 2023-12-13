import { Parent } from '../domain/Parent.js'
import { Student, StudentCreationSchema, StudentUpdateSchema } from '../domain/Student.js'
import { ClassService } from '../services/ClassService.js'
import { StudentService } from '../services/StudentService.js'
import { Router } from './lib/Router.js'
import zodValidationMiddleware from './middlewares/zodValidationMiddleware.js'

export function studentRouterFactory(studentService: StudentService, classService: ClassService) {
  const router = new Router('/students')

  router.get('/:id', async (req, res) => {
    const student = studentService.findById(req.params.id)
    return res.json(student.toObject())
  })

  router.get('/', async (_, res) => {
    return res.json((studentService.list() as Student[]).map((student: Student) => student.toObject())) // FIXME: Como melhorar?
  })

  router.post('/', async (req, res) => {
    const body = zodValidationMiddleware(StudentCreationSchema.omit({ id: true }), await req.body())
    const student = studentService.create(body)
    // verifica se a classe existe antes de inserir o objeto
    classService.findById(body.class)
    return res.status(201).json(student.toObject())
  })

  router.put('/:id', async (req, res) => {
    const body = zodValidationMiddleware(StudentUpdateSchema, await req.body())
    const { id } = req.params
    const updated = studentService.update(id, body)
    return res.json(updated.toObject())
  })

  router.delete('/:id', async (req, res) => {
    studentService.remove(req.params.id)
    return void res.status(204).end()
  })

  router.get('/:id/parents', async (req, res) => {
    const { id } = req.params
    const parents = studentService.getParents(id) as Parent[] // FIXME: Como melhorar?
    return res.json(parents.map((parent: Parent) => parent.toObject()))
  })

  router.patch('/:id/parents', async (req, res) => {
    const body = zodValidationMiddleware(StudentCreationSchema.pick({ parents: true }), await req.body())
    const { id } = req.params
    const { parents } = body
    return res.json(studentService.linkParents(id, parents).toObject())
  })

  return router
}
