import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../../db/database'

export async function createUserRoute(app: FastifyInstance) {
  app.post('/create-user', async (request, reply) => {
    const createUserSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email({ message: 'Invalid email address' }),
      phone_number: z.string(),
    })
    const {
      firstName,
      lastName,
      email,
      phone_number: phoneNumber,
    } = createUserSchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 Days
      })
    }

    const newUser = {
      id: randomUUID(),
      firstName,
      lastName,
      email,
      phone_number: phoneNumber,
      is_active: true,
      session_id: sessionId,
    }

    await knex('users').insert(newUser)

    return reply.status(201).send()
  })
}
