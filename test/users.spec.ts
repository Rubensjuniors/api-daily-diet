import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

const mockUser = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone_number: '+0987654321',
}

describe('/users', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  it('Should be possible to create a user', async () => {
    await request(app.server).post('/create-user').send(mockUser).expect(201)
  })
  it('Should be possible to list all users', async () => {
    await request(app.server).post('/create-user').send(mockUser)

    const allUsers = await request(app.server).get('/users').expect(200)

    expect(allUsers.body.users).toEqual([expect.objectContaining(mockUser)])
  })
  it('Should be possible to list a single user using id', async () => {
    await request(app.server).post('/create-user').send(mockUser)

    const {
      body: { users },
    } = await request(app.server).get('/users')

    const { body } = await request(app.server).get(`/users/${users[0].id}`)

    expect(body[0]).toEqual(expect.objectContaining(mockUser))
  })
})
