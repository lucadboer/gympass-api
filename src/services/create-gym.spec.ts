import { InMemmoryGymRepository } from '@/repositories/in-memmory/in-memmory-gym-repository'
import { Decimal } from '@prisma/client/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymService } from './create-gym'
import { GymAlreadyExistError } from './errors/gym-already-exist-error'

let gymRepository: InMemmoryGymRepository
let sut: CreateGymService

describe('Register Service', async () => {
  beforeEach(() => {
    gymRepository = new InMemmoryGymRepository()
    sut = new CreateGymService(gymRepository)
  })

  const testGym = {
    id: 'gym-01',
    title: 'Test Academy',
    description: '',
    phone: '',
    latitude: new Decimal(-21.2473928),
    longitude: new Decimal(-48.5015737),
  }

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute(testGym)

    expect(gym.id).toEqual(expect.any(String))
  })

  it('should not be able to create duplicate gym', async () => {
    await sut.execute({
      id: 'gym-01',
      title: 'Test Academy',
      description: '',
      phone: '',
      latitude: new Decimal(-21.2473928),
      longitude: new Decimal(-48.5015737),
    })

    await expect(() =>
      sut.execute({
        id: 'gym-01',
        title: 'Test Academy',
        description: '',
        phone: '',
        latitude: new Decimal(-21.2473928),
        longitude: new Decimal(-48.5015737),
      }),
    ).rejects.toBeInstanceOf(GymAlreadyExistError)
  })
})
