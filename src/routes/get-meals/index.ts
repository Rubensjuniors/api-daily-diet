import { FastifyInstance } from 'fastify'
import { checkSessionIdExits } from '../../middlewares/check-seesion-id'
import { knex } from '../../db/database'
import { z } from 'zod'

export async function mealsRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await checkSessionIdExits(request, reply)
  })
  app.get('/', async (request) => {
    const { sessionId } = request.cookies
    const allMeals = await knex('meals').select().where('session_id', sessionId)

    return { meals: allMeals }
  })
  app.get('/:id', async (request) => {
    const { sessionId } = request.cookies
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(request.params)

    const getMeals = await knex('meals').select().where({
      id,
      session_id: sessionId,
    })

    return getMeals
  })
}
