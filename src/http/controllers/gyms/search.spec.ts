import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Search Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able search for a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Trinket Gym',
        description: 'A Gym where you train with scraps',
        phone: null,
        latitude: -21.7883365,
        longitude: -43.3584189,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Solar Gym',
        description: 'A Gym where you train with brains',
        phone: null,
        latitude: -21.7883365,
        longitude: -43.3584189,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'Solar',
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Solar Gym',
      }),
    ])
  })
})
