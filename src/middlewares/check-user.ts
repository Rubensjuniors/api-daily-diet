import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../db/database'
import { z } from 'zod'

export async function checkUserAndSessionsIdEqualsUserSessionId(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  const user = await knex('users')
    .select('id', 'session_id')
    .where('session_id', sessionId)
    .first()

  if (!user?.id && sessionId !== user?.session_id) {
    return replay.status(401).send({
      error: 'Unauthorized',
    })
  }
}

export async function checkUserExist(
  request: FastifyRequest,
  replay: FastifyReply,
) {
  const getUserParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserParamsSchema.parse(request.params)
  if (!id) {
    return replay.status(404).send({
      error: 'Not Found!!',
    })
  }

  const user = await knex('users').select('id').where('id', id).first()

  if (!user?.id) {
    return replay.status(401).send({
      error: 'User does not exist!',
    })
  }
}
