import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'Trinket Gym',
      description: 'A Gym where you train with scraps',
      phone: '',
      latitude: new Decimal(-21.7883365),
      longitude: new Decimal(-43.3584189),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.7883365,
      userLongitude: -43.3584189,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in a day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.7883365,
      userLongitude: -43.3584189,
    })

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -21.7883365,
        userLongitude: -43.3584189,
      })
    }).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.7883365,
      userLongitude: -43.3584189,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.7883365,
      userLongitude: -43.3584189,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.7883365,
      userLongitude: -43.3584189,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in a distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Trinket Gym',
      description: 'A Gym where you train with scraps',
      phone: '',
      latitude: new Decimal(-21.7804047),
      longitude: new Decimal(-43.3619175),
    })

    expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -21.7883365,
        userLongitude: -43.3584189,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
