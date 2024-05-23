import app from '@adonisjs/core/services/app'
import { RabbitManagerContract } from '../src/types.js'

let rabbitmq: RabbitManagerContract

await app.booted(async () => {
  rabbitmq = await app.container.make('rabbitmq')
})

export { rabbitmq as default }
