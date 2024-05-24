import type { ApplicationService } from '@adonisjs/core/types'
import { RuntimeException } from '@poppinss/utils'
import { RabbitManager } from '../src/rabbitmq_manager.js'
import { RabbitConfig, RabbitManagerContract } from '../src/types.js'

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    rabbit: RabbitManagerContract
  }
}

export default class RabbitMQProvider {
  constructor(protected app: ApplicationService) {}

  async register() {
    this.app.container.singleton('rabbit', async (resolver) => {
      const configService = await resolver.make('config')

      const config = configService.get<RabbitConfig>('rabbit')

      if (!config) {
        throw new RuntimeException(
          'Invalid config exported from "config/rabbitmq.ts" file. Make sure to use the defineConfig method'
        )
      }

      return new RabbitManager({ ...config })
    })
  }

  public async shutdown() {
    const Rabbit: RabbitManagerContract = await this.app.container.make('rabbit')
    await Rabbit.closeChannel()
    await Rabbit.closeConnection()
  }
}
