import app from '@adonisjs/core/services/app'
import { RabbitManagerContract } from '../src/types.js'

let rabbit: RabbitManagerContract

await app.booted(async () => {
  rabbit = await app.container.make('rabbit')
})

export { rabbit as Rabbit }
