import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Trinket Gym',
      description: 'A Gym where you train with scraps',
      phone: null,
      latitude: -21.7883365,
      longitude: -43.3584189,
    })

    await gymsRepository.create({
      title: 'Module Gym',
      description: 'A Gym where you train your brain',
      phone: null,
      latitude: -21.7883365,
      longitude: -43.3584189,
    })

    const { gyms } = await sut.execute({
      query: 'Module Gym',
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Module Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Module Gym ${i}`,
        description: 'A Gym where you train your brain',
        phone: null,
        latitude: -21.7883365,
        longitude: -43.3584189,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Module Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Module Gym 21' }),
      expect.objectContaining({ title: 'Module Gym 22' }),
    ])
  })
})
