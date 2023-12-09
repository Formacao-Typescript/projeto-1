import { createServer } from 'node:http'
import type { ServiceList } from '../app.js'
import type { AppConfig } from '../config.js'
import { classRouterFactory } from './class.js'
import { defaultRouterFactory } from './default.js'
import { match, routerFactory } from './lib/router.js'
import { parentRouterFactory } from './parent.js'
import { studentRouterFactory } from './student.js'
import { teacherRouterFactory } from './teacher.js'

// ServiceList aqui pode ser um index type como [key: string]: Service<any, any>
// Como podemos deixar ele específico e mais seguro? Temos que pegar o retorno da função initDependencies
export async function WebLayer(config: AppConfig, services: ServiceList) {
  const routes = await routerFactory(
    new Map([
      ...defaultRouterFactory(),
      ...classRouterFactory(services.class),
      ...teacherRouterFactory(services.teacher, services.student, services.class),
      ...parentRouterFactory(services.parent, services.student),
      ...studentRouterFactory(services.student, services.class),
    ]),
  )
  let server = createServer(async (req, res) => {
    try {
      await match(routes, req, res)
    } catch (err: any) {
      console.error(err)
      res.writeHead(err?.status ?? 500, { 'Content-type': 'application/json' })
      res.write(
        JSON.stringify({
          code: err?.code ?? 'UNKNOWN_ERROR',
          message: err?.message ?? 'Unknown error',
          name: err?.name ?? 'Unknown error',
          ...err,
        }),
      )
    } finally {
      return res.end()
    }
  })

  const start = async () => {
    console.debug('Starting web layer')
    server.listen(config.PORT, () => console.info(`Listening on port ${config.PORT}`))
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
    stop,
  }
}
