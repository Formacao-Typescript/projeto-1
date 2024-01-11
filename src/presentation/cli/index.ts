import { ServiceList } from '../../app.js'
import { AppConfig } from '../../config.js'
import { Command } from 'commander'
import { subcommandHandler } from './commands/subcommandHandler.js'

export async function CLILayer(_config: AppConfig, services: ServiceList) {
  const program = new Command()

  program.name('School CLI').version('0.0.1').description('School CLI for managing a school api')

  program
    .command('parent')
    .argument('<subcommand>', 'Subcommand to be executed: create, delete, list, find')
    .option('-i, --id [id]', 'If subcommand is find or delete, the id of the parent to be found or deleted')
    .action((subcommand, options) => subcommandHandler(services, 'parent', subcommand, options))

  return {
    async start() {
      program.parse()
    },
    stop() {
      return
    }
  }
}
