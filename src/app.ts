import { appConfig, type AppConfig } from './config.js'
import { ClassRepository } from './data/ClassRepository.js'
import { ParentRepository } from './data/ParentRepository.js'
import { StudentRepository } from './data/StudentRepository.js'
import { TeacherRepository } from './data/TeacherRepository.js'
import { connectToDatabase } from './data/connection.js'
import { WebLayer } from './presentation/index.js'
import { ClassService } from './services/ClassService.js'
import { ParentService } from './services/ParentService.js'
import { StudentService } from './services/StudentService.js'
import { TeacherService } from './services/TeacherService.js'

// Como podemos deixar o retorno de initDependencies mais específico e seguro?
// Usamos o retorno de initDependencies para tipar o parâmetro services de WebLayer
// Se não poderíamos tipar o parâmetro services de WebLayer como um indexed type
// [key: string]: Service<any, any>
export type ServiceList = Awaited<ReturnType<typeof initDependencies>>['services']
export type Application = (
  config: AppConfig,
  services: ServiceList
) => Promise<{
  stop: () => void
  start: () => Promise<void>
}>

async function initDependencies(config: AppConfig) {
  const { db, close } = await connectToDatabase(config)
  const repositories = {
    class: new ClassRepository(db),
    student: new StudentRepository(db),
    parent: new ParentRepository(db),
    teacher: new TeacherRepository(db)
  }

  const teacherService = new TeacherService(repositories.teacher)
  const parentService = new ParentService(repositories.parent)
  const studentService = new StudentService(repositories.student, parentService)
  const classService = new ClassService(repositories.class, teacherService, studentService)

  return {
    repositories,
    services: {
      teacher: teacherService,
      parent: parentService,
      student: studentService,
      class: classService
    },
    dispose: async () => close()
  }
}

async function main(app: Application, config: AppConfig) {
  const { services, dispose } = await initDependencies(config)
  const { start, stop } = await app(config, services)

  process.on('SIGINT', async () => {
    console.info('SIGINT signal received.')
    stop()
    await dispose()
  })
  process.on('SIGTERM', async () => {
    console.info('SIGTERM signal received.')
    stop()
    await dispose()
  })
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection', reason)
  })
  process.on('uncaughtException', async (error) => {
    console.error('Uncaught exception', error)
    stop()
    await dispose()
  })
  return start()
}

await main(WebLayer, appConfig)
