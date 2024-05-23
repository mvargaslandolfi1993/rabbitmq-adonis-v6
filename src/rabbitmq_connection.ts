import { RabbitConfig } from './types.js'
import { connect, Connection, Options } from 'amqplib'
import InvalidRabbitConfigException from './exceptions/InvalidRabbitConfigException.js'

export default class RabbitConnection {
  /**
   * Whether the connection has already been established
   */
  public hasConnection: boolean = false

  /**
   * The connection
   */
  private $connection: Connection | null = null

  private $connectionPromise: Promise<Connection> | null = null

  private $amqpConfig: Options.Connect

  /**
   * The credentials
   */
  private readonly $credentials: string

  /**
   * The hostname
   */
  private readonly $hostname: string

  /**
   * The protocol
   */
  private readonly $protocol: string

  constructor(private readonly rabbitConfig: RabbitConfig) {
    this.$credentials = this.handleCredentials(this.rabbitConfig.user, this.rabbitConfig.password)
    this.$hostname = this.handleHostname(this.rabbitConfig.hostname, this.rabbitConfig.port)

    this.$protocol = this.handleProtocol(this.rabbitConfig.protocol)

    this.$amqpConfig = {
      username: this.rabbitConfig.user,
      password: this.rabbitConfig.password,
      protocol: this.$protocol,
      hostname: this.rabbitConfig.hostname,
      port: this.rabbitConfig.port,
      heartbeat: this.handleHeartBeat(this.rabbitConfig.heartbeat),
    }
  }

  /**
   * Returns the credentials
   *
   * @param user The username
   * @param password The password
   */
  private handleCredentials(user: RabbitConfig['user'], password: RabbitConfig['password']) {
    if (!user) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ user')
    }

    if (!password) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ password')
    }

    return `${user}:${password}@`
  }

  /**
   * Returns the hostname
   *
   * @param hostname The hostname
   * @param port The port
   */
  private handleHostname(hostname: RabbitConfig['hostname'], port?: RabbitConfig['port']) {
    if (!hostname) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ hostname')
    }

    return port ? `${hostname}:${port}` : hostname
  }

  /**
   * Returns the heart beat
   * @param heartBeat
   * @returns
   */
  private handleHeartBeat(heartBeat: RabbitConfig['heartbeat']) {
    if (!heartBeat) {
      return 60
    }

    return heartBeat
  }
  /**
   * Custom protocol
   *
   * @param protocol
   */
  private handleProtocol(protocol: RabbitConfig['protocol']) {
    if (!protocol) {
      protocol = 'amqp://'
    }

    return protocol
  }

  /**
   * Returns the connection URL
   */
  public get url() {
    return [this.$protocol, this.$credentials, this.$hostname].join('')
  }

  /**
   * Returns the connection
   */
  public async getConnection() {
    if (!this.$connection) {
      if (!this.$connectionPromise) {
        this.$connectionPromise = connect(this.$amqpConfig) as unknown as Promise<Connection>
      }
      this.$connection = await this.$connectionPromise
    }

    return this.$connection
  }

  /**
   * Create and returns the connection
   */
  public async createConnection() {
    try {
      this.$connectionPromise = connect(this.$amqpConfig) as unknown as Promise<Connection>

      this.$connection = await this.$connectionPromise

      return true
    } catch (error) {
      return false
    }
  }
  /**
   * Closes the connection
   */
  public async closeConnection() {
    if (this.hasConnection && this.$connection) {
      await this.$connection.close()
      this.hasConnection = false
    }
  }
}
