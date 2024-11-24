// FastifyRequestContext
import 'fastify'
import { IUser } from './types'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: IUser
  }
}
