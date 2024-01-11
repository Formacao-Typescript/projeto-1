#!/usr/bin/env tsx
import { appConfig, type AppConfig } from './config.js'
import { ClassRepository } from './data/ClassRepository.js'
import { ParentRepository } from './data/ParentRepository.js'
import { StudentRepository } from './data/StudentRepository.js'
import { TeacherRepository } from './data/TeacherRepository.js'
import { CLILayer } from './presentation/cli/index.js'
import { WebLayer } from './presentation/rest/index.js'
import { ClassService } from './services/ClassService.js'
import { ParentService } from './services/ParentService.js'
import { StudentService } from './services/StudentService.js'
import { TeacherService } from './services/TeacherService.js'

// Como podemos deixar o retorno de initDependencies mais específico e seguro?
// Usamos o retorno de initDependencies para tipar o parâmetro services de WebLayer
// Se não poderíamos tipar o parâmetro services de WebLayer como um indexed type
// [key: string]: Service<any, any>
export type ServiceList = ReturnType<typeof initDependencies>['services']
export type Application = (
  config: AppConfig,
  services: ServiceList
) => Promise<{
  stop: () => void
  start: () => Promise<void>
}>

function initDependencies() {
  const repositories = {
    class: new ClassRepository(),
    student: new StudentRepository(),
    parent: new ParentRepository(),
    teacher: new TeacherRepository()
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
    }
  }
}

async function main(app: Application, config: AppConfig) {
  const { services } = initDependencies()
  const { start, stop } = await app(config, services)

  process.on('SIGINT', () => {
    console.info('SIGINT signal received.')
    stop()
  })
  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.')
    stop()
  })
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection', reason)
  })
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception', error)
    stop()
  })
  return start()
}

if (process.env.IS_WEB) {
  await main(WebLayer, appConfig)
} else {
  await main(CLILayer, appConfig)
}
