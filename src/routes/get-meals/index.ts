import { FastifyInstance } from 'fastify'

import { knex } from '../../db/database'
import { z } from 'zod'
import { checkUserAndSessionsId } from '../../middlewares/check-user'

export async function mealsRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await checkUserAndSessionsId(request, reply)
  })
  app.get('/', async (request) => {
    const user = request.user
    const allMeals = await knex('meals').select().where('user_id', user?.id)

    return { meals: allMeals }
  })
  app.get('/:id', async (request) => {
    const user = request.user
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const getMeals = await knex('meals').select().where({
      id,
      user_id: user?.id,
    })

    return getMeals
  })
}
