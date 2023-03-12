import { InMemmoryUserRepository } from '@/repositories/in-memmory/in-memmory-user-repositry'
import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlreadyExistError } from './errors/user-already-exist-error'
import { RegisterService } from './register'

let usersRepository: InMemmoryUserRepository
let sut: RegisterService

describe('Register Service', async () => {
  beforeEach(() => {
    usersRepository = new InMemmoryUserRepository()
    sut = new RegisterService(usersRepository)
  })

  const testUser = {
    name: 'John Doe',
    email: 'john@doe.com',
    password: '123456',
  }

  it('should be able to create a new user', async () => {
    const { user } = await sut.execute(testUser)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to create with same email', async () => {
    await sut.execute(testUser)

    await expect(async () => {
      await sut.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should be able to create password hash correctly', async () => {
    const { user } = await sut.execute(testUser)
    const isCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isCorrectlyHashed).toBe(true)
  })
})
