import { InMemmoryCheckInRepository } from '@/repositories/in-memmory/in-memmory-check-in-repository'
import { InMemmoryGymRepository } from '@/repositories/in-memmory/in-memmory-gym-repository'
import { Decimal } from '@prisma/client/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInService } from './check-in'

let checkInRepository: InMemmoryCheckInRepository
let gymRepository: InMemmoryGymRepository
let sut: CheckInService

describe('Check-in Service', async () => {
  beforeEach(() => {
    checkInRepository = new InMemmoryCheckInRepository()
    gymRepository = new InMemmoryGymRepository()

    sut = new CheckInService(checkInRepository, gymRepository)

    vi.useFakeTimers()

    gymRepository.items.push({
      id: 'gym-01',
      title: 'Test Academy',
      description: '',
      phone: '',
      latitude: new Decimal(-21.2473928),
      longitude: new Decimal(-48.5015737),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.2473928,
      userLongitude: -48.5015737,
    })

    expect(checkIn.user_id, checkIn.gym_id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.2473928,
      userLongitude: -48.5015737,
    })

    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -21.2473928,
          userLongitude: -48.5015737,
        }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in diff days', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.2473928,
      userLongitude: -48.5015737,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -21.2473928,
      userLongitude: -48.5015737,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in distance', async () => {
    gymRepository.items.push({
      id: 'gym-02',
      title: 'Test Academy',
      description: '',
      phone: '',
      latitude: new Decimal(-21.216664),
      longitude: new Decimal(-48.4429476),
    })

    await expect(() => {
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -21.2473928,
        userLongitude: -48.5015737,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
