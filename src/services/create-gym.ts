import { Gym, Prisma } from '@prisma/client'
import { GymRepository } from '@/repositories/gym-repository'
import { randomUUID } from 'crypto'
import { GymAlreadyExistError } from './errors/gym-already-exist-error'

interface CreateGymServiceRequest {
  id: string
  title: string
  description: string | null
  phone: string | null
  latitude: Prisma.Decimal
  longitude: Prisma.Decimal
}

interface CreateGymServiceResponse {
  gym: Gym
}

export class CreateGymService {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    id,
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const isGymAlreadyExist = await this.gymRepository.findById(id)

    if (isGymAlreadyExist) {
      throw new GymAlreadyExistError()
    }

    const gym = await this.gymRepository.create({
      id: randomUUID(),
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
