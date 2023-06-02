import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'A Gym where you train with scraps',
      phone: null,
      latitude: -21.7883365,
      longitude: -43.3584189,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'A Gym where you train your brain',
      phone: null,
      latitude: -19.8332666,
      longitude: -43.5743734,
    })

    const { gyms } = await sut.execute({
      userLatitude: -21.7883365,
      userLongitude: -43.3584189,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
