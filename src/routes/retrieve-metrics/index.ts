import { FastifyInstance } from 'fastify'
import { knex } from '../../db/database'
import { z } from 'zod'

export async function retrieveMetricsRoute(app: FastifyInstance) {
  app.get('/metrics/:id', async (request) => {
    const getMealsIdParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsIdParamsSchema.parse(request.params)
    const totalMeals = await knex('meals').select().where('user_id', id)
    const totalMealsInDiet = await knex('meals')
      .select()
      .where('user_id', id)
      .andWhere('in_diet', true)
      .count('*', { as: 'total_meals_in_diet' })
      .first()
    const totalMealsOffDiet = await knex('meals')
      .select()
      .where('user_id', id)
      .andWhere('in_diet', false)
      .count('*', { as: 'meals_off_diet' })
      .first()

    const { bestOnDietSequence } = totalMeals.reduce(
      (acc, meal) => {
        if (meal.in_diet) {
          acc.currentSequence += 1
        } else {
          acc.currentSequence = 0
        }

        if (acc.currentSequence > acc.bestOnDietSequence) {
          acc.bestOnDietSequence = acc.currentSequence
        }

        return acc
      },
      { bestOnDietSequence: 0, currentSequence: 0 },
    )

    return {
      totalMeals: totalMeals?.length,
      totalMealsInDiet: totalMealsInDiet?.total_meals_in_diet,
      totalMealsOffDiet: totalMealsOffDiet?.meals_off_diet,
      bestOnDietSequence,
    }
  })
}
