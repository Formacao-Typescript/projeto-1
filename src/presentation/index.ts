import Express, { type NextFunction, type Request, type Response } from 'express'
import helmet from 'helmet'
import type { Server } from 'http'
import type { ServiceList } from '../app.js'
import type { AppConfig } from '../config.js'
import { classRouterFactory } from './class.js'
import { parentRouterFactory } from './parent.js'
import { studentRouterFactory } from './student.js'
import { teacherRouterFactory } from './teacher.js'

// ServiceList aqui pode ser um index type como [key: string]: Service<any, any>
// Como podemos deixar ele específico e mais seguro? Temos que pegar o retorno da função initDependencies
export async function WebLayer(config: AppConfig, services: ServiceList) {
  const app = Express()
  let server: Server | undefined
  app.use(helmet())
  app.use(Express.json())
  app.use('/classes', classRouterFactory(services.class))
  app.use('/teachers', teacherRouterFactory(services.teacher, services.student, services.class))
  app.use('/parents', parentRouterFactory(services.parent, services.student))
  app.use('/students', studentRouterFactory(services.student, services.class))
  app.get('/ping', (_, res) => res.send('pong'))
  app.use(async (err: any, _: Request, res: Response, next: NextFunction) => {
    if (err) {
      return res
        .status(err?.status ?? 500)
        .json({ code: err?.code ?? 'UNKNOWN_ERROR', message: err.message, name: err.name })
    }
    next()
  })

  const start = async () => {
    console.debug('Starting web layer')
    server = app.listen(config.PORT, () => console.info(`Listening on port ${config.PORT}`))
  }

  const stop = () => {
    console.debug('Stopping web layer')
    if (server) {
      server.close((err) => {
        let exitCode = 0
        if (err) {
          console.error('Error closing web layer', err)
          exitCode = 1
        }
        console.info('Web layer stopped')
        process.exit(exitCode)
      })
    }
  }

  return {
    start,
    stop
  }
}
