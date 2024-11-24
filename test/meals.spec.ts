import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

const mockUser = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone_number: '+0987654321',
}

const mockMeals = {
  name: 'Pizza',
  datetime: '2024-11-24T12:30:00Z',
  description: 'One Pizza',
  in_diet: false,
}

const mockMealsPut = {
  name: 'Pizza 2',
  datetime: '2024-11-24T12:30:00Z',
  description: 'two Pizza',
  in_diet: false,
}

describe('/meals', async () => {
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

  it('Should be possible to create a meal', async () => {
    const createUser = await request(app.server)
      .post('/create-user')
      .send(mockUser)
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/create-meals')
      .set('Cookie', String(cookies))
      .send(mockMeals)
      .expect(201)
  })
  it('Should be possible to list all meals', async () => {
    const createUser = await request(app.server)
      .post('/create-user')
      .send(mockUser)
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/create-meals')
      .set('Cookie', String(cookies))
      .send(mockMeals)
      .expect(201)

    const allMeals = await request(app.server)
      .get('/meals')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(allMeals.body.meals).toHaveLength(1)
    expect(allMeals.body.meals[0].name).toBe(mockMeals.name)
  })
  it('Should be possible to list only one meal by one id', async () => {
    const createUser = await request(app.server)
      .post('/create-user')
      .send(mockUser)
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/create-meals')
      .set('Cookie', String(cookies))
      .send(mockMeals)
      .expect(201)

    const {
      body: { meals },
    } = await request(app.server)
      .get('/meals')
      .set('Cookie', String(cookies))
      .expect(200)

    const getMeal = await request(app.server)
      .get(`/meals/${meals[0].id}`)
      .set('Cookie', String(cookies))
      .expect(200)

    expect(getMeal.body[0].name).toBe(mockMeals.name)
  })
  it('Should be possible to update an existing meal', async () => {
    const createUser = await request(app.server)
      .post('/create-user')
      .send(mockUser)
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/create-meals')
      .set('Cookie', String(cookies))
      .send(mockMeals)
      .expect(201)

    const {
      body: { meals },
    } = await request(app.server)
      .get('/meals')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(meals[0].name).toBe(mockMeals.name)

    await request(app.server)
      .put(`/meals/${meals[0].id}`)
      .set('Cookie', String(cookies))
      .send(mockMealsPut)
      .expect(201)

    const {
      body: { meals: updateMeals },
    } = await request(app.server)
      .get('/meals')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(updateMeals[0].name).toBe(mockMealsPut.name)
  })
  it('Should be possible to delete an existing meal', async () => {
    const createUser = await request(app.server)
      .post('/create-user')
      .send(mockUser)
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/create-meals')
      .set('Cookie', String(cookies))
      .send(mockMeals)
      .expect(201)

    const {
      body: { meals },
    } = await request(app.server)
      .get('/meals')
      .set('Cookie', String(cookies))
      .expect(200)

    expect(meals[0].name).toBe(mockMeals.name)

    await request(app.server)
      .delete(`/meals/${meals[0].id}`)
      .set('Cookie', String(cookies))
      .expect(201)
  })
})
