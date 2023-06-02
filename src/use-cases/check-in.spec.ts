import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
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

  it('should not be able to check in a inexistent gym', () => {
    expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -21.7883365,
        userLongitude: -43.3584189,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
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
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
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
    await gymsRepository.create({
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
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
