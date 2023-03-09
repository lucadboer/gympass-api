import { UserRepository } from './users-repository'
import { prisma } from '@/libs/prisma'
import { Prisma, User } from '@prisma/client'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    console.log(user)

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User | null> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
