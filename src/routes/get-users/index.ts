import { FastifyInstance } from 'fastify'
import { knex } from '../../db/database'
import { z } from 'zod'
import { checkUserExist } from '../../middlewares/check-user'

export async function usersRotue(app: FastifyInstance) {
  app.get('/', async () => {
    const allUsers = await knex('users').select()

    return { users: allUsers }
  })
  app.get(
    '/:id',
    {
      preHandler: [checkUserExist],
    },
    async (request) => {
      const getUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserParamsSchema.parse(request.params)

      const getUser = await knex('users').where('id', id).select()

      return getUser
    },
  )
}
