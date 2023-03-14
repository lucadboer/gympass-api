import { prisma } from '@/libs/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from '../check-in-repository'

export class PrismaCheckInRepository implements CheckInRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    throw new Error('Method not implemented.')
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }
}
