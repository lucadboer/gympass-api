import { Prisma, User } from '@prisma/client'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(user: Prisma.UserCreateInput): Promise<User>
}
