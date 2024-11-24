import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../../db/database'
import { randomUUID } from 'node:crypto'
import { checkUserAndSessionsId } from '../../middlewares/check-user'
import { filteredObeject } from '../../utils/filteredObject'

export async function createMealsRoute(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await checkUserAndSessionsId(request, reply)
  })
  app.post('/create-meals', async (request, reply) => {
    const user = request.user
    const createMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      datetime: z.string(),
      in_diet: z.boolean(),
    })

    const {
      name,
      datetime,
      description,
      in_diet: inDiet,
    } = createMealSchema.parse(request.body)

    const newMeals = {
      id: randomUUID(),
      name,
      datetime,
      description,
      in_diet: inDiet,
      user_id: user?.id,
    }

    await knex('meals').insert(newMeals)

    return reply.status(201).send()
  })
  app.put('/meals/:id', async (request, reply) => {
    const getMelasIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const updateMealSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      datetime: z.string().optional(),
      in_diet: z.boolean().optional(),
    })
    const { id } = getMelasIdParamsSchema.parse(request.params)
    const {
      name,
      datetime,
      description,
      in_diet: inDiet,
    } = updateMealSchema.parse(request.body)

    const newUpdates = filteredObeject({
      name,
      datetime,
      description,
      in_diet: inDiet,
    })

    await knex('meals').where({ id }).update(newUpdates)

    return reply.status(201).send()
  })
  app.delete('/meals/:id', async (request, reply) => {
    const getMelasIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMelasIdParamsSchema.parse(request.params)

    await knex('meals').where({ id }).delete()

    return reply.status(201).send()
  })
}
