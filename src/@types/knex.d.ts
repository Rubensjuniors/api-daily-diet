// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone_number: string
      is_active: boolean
      created_at: string
      updated_at?: string
      session_id?: string
    }
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
