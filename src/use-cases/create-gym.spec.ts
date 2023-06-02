import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'Trinket Gym',
      description: 'A Gym where you train with scraps',
      phone: null,
      latitude: -21.7883365,
      longitude: -43.3584189,
    })

    expect(gym).toBeTruthy()
  })
})
