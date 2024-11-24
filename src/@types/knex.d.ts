// eslint-disable-next-line
import { Knex } from 'knex'
import { IUser } from './types'

declare module 'knex/types/tables' {
  export interface Tables {
    users: IUser
    meals: {
      id: string
      name: string
      description: string
      datetime: string
      in_diet: boolean
      user_id: string
      session_id?: string
    }
  }
}
