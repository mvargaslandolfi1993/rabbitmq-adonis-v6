import type { RabbitConfig } from './types.js'
import { RuntimeException } from '@poppinss/utils'

export function defineConfig(config: RabbitConfig): RabbitConfig {
  if (!config.hostname) {
    throw new RuntimeException('Missing "hostname" property in rabbitmq config.')
  }

  if (!config.password) {
    throw new RuntimeException('Missing "password" property in sentry config.')
  }

  if (!config.port) {
    throw new RuntimeException('Missing "port" property in sentry config.')
  }

  if (!config.user) {
    throw new RuntimeException('Missing "user" property in sentry config.')
  }

  return {
    ...config,
  }
}
