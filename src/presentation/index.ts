import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import type { ServiceList } from '../app.js'
import type { AppConfig } from '../config.js'
import { classRouterFactory } from './class.js'
import { parentRouterFactory } from './parent.js'
import { studentRouterFactory } from './student.js'
import { teacherRouterFactory } from './teacher.js'
import { ZodError, z } from 'zod'

export const onlyIdParamSchema = { schema: { params: z.object({ id: z.string().uuid() }) } }

// ServiceList aqui pode ser um index type como [key: string]: Service<any, any>
// Como podemos deixar ele específico e mais seguro? Temos que pegar o retorno da função initDependencies
export async function WebLayer(config: AppConfig, services: ServiceList) {
  const app = Fastify({
    logger: true
  })
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
  app.setErrorHandler(function (error, _, reply) {
    if (error instanceof ZodError) {
      error.statusCode = 422
      return reply.status(422).send({
        code: 'INVALID_PAYLOAD',
        message: 'Invalid payload',
        errors: error.issues
      })
    }
    return reply.send(error)
  })

  let server: typeof app

  app.register(classRouterFactory(services.class), { prefix: '/classes' })
  app.register(teacherRouterFactory(services.teacher, services.student, services.class), {
    prefix: '/teachers'
  })
  app.register(parentRouterFactory(services.parent, services.student), { prefix: '/parents' })
  app.register(studentRouterFactory(services.student, services.class), { prefix: '/students' })

  app.get('/ping', (_, res) => res.send('pong'))

  const start = async () => {
    console.debug('Starting web layer')
    server = app
    await app.listen({
      port: config.PORT
    })
    console.info(`Listening on port ${config.PORT}`)
  }

  const stop = () => {
    console.debug('Stopping web layer')
    if (server) {
      server.close(() => {
        console.info('Web layer stopped')
        process.exit(0)
      })
    }
  }

  return {
    start,
    stop
  }
}
