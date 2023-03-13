import { hash } from 'bcryptjs'
import { InMemmoryUserRepository } from '@/repositories/in-memmory/in-memmory-user-repositry'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileService } from './get-user-profile'
import { ResourcesNotFoundError } from './errors/resources-not-found-error'

let usersRepository: InMemmoryUserRepository
let sut: GetUserProfileService

describe('Get User Profile Service', async () => {
  beforeEach(() => {
    usersRepository = new InMemmoryUserRepository()
    sut = new GetUserProfileService(usersRepository)
  })

  const testUser = {
    name: 'John Doe',
    email: 'john@doe.com',
    password_hash: await hash('123456', 6),
  }

  it('should be able to get user by id', async () => {
    const createdUser = await usersRepository.create(testUser)

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.email).toEqual('john@doe.com')
  })

  it('should not be able to get user by id', async () => {
    expect(async () => {
      await sut.execute({
        userId: 'non-exsiting-id',
      })
    }).rejects.toBeInstanceOf(ResourcesNotFoundError)
  })
})
