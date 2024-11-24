import fastify from 'fastify'
import { createUserRoute } from './routes/create-users'
import cookie from '@fastify/cookie'
import { usersRotue } from './routes/get-users'
import { createMealsRoute } from './routes/create-meals'
import { mealsRoute } from './routes/get-meals'
import { retrieveMetricsRoute } from './routes/retrieve-metrics'

export const app = fastify()

app.register(cookie)
app.register(createUserRoute)
app.register(usersRotue, {
  prefix: 'users',
})
app.register(createMealsRoute)
app.register(mealsRoute, {
  prefix: 'meals',
})
app.register(retrieveMetricsRoute)
