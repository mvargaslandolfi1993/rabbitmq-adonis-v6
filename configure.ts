import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

/**
 * Configures the package
 */
export async function configure(command: ConfigureCommand) {
  const codemods = await command.createCodemods()

  /**
   * Publish config file
   */
  await codemods.makeUsingStub(stubsRoot, 'config/rabbit.stub', {})

  await codemods.makeUsingStub(stubsRoot, 'start/rabbit.stub', {})

  /**
   * Publish provider and command
   */
  await codemods.updateRcFile((rcFile: any) => {
    rcFile.addProvider('rabbitmq-adonis-v6/rabbitmq_provider')
    rcFile.addPreloadFile('#start/rabbit', ['web'])
  })

  /**
   * Define env variables
   */
  await codemods.defineEnvVariables({
    RABBITMQ_HOSTNAME: 'localhost',
    RABBITMQ_USER: '',
    RABBITMQ_PASSWORD: '',
    RABBITMQ_PORT: '',
    RABBITMQ_PROTOCOL: 'amqp',
    RABBITMQ_HEARTBEAT: 60,
  })

  /**
   * Define env variables validation
   */
  await codemods.defineEnvValidations({
    variables: {
      RABBITMQ_HOSTNAME: 'Env.schema.string()',
      RABBITMQ_USER: 'Env.schema.string()',
      RABBITMQ_PASSWORD: 'Env.schema.string()',
      RABBITMQ_PORT: 'Env.schema.number()',
      RABBITMQ_PROTOCOL: 'Env.schema.string()',
      RABBITMQ_HEARTBEAT: 'Env.schema.number.optional()',
    },
    leadingComment: 'Variables for Rabbitmq',
  })
}
