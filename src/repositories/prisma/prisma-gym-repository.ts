import { prisma } from '@/libs/prisma'
import { Gym, Prisma } from '@prisma/client'
import { GymRepository } from '../gym-repository'

export class PrismaGymRepository implements GymRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}
