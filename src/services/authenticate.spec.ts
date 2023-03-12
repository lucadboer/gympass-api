import { hash } from 'bcryptjs'
import { InMemmoryUserRepository } from '@/repositories/in-memmory/in-memmory-user-repositry'
import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemmoryUserRepository
let sut: AuthenticateService

describe('Authenticate Service', async () => {
  beforeEach(() => {
    usersRepository = new InMemmoryUserRepository()
    sut = new AuthenticateService(usersRepository)
  })

  const testUser = {
    name: 'John Doe',
    email: 'john@doe.com',
    password_hash: await hash('123456', 6),
  }

  it('should be able to authenticate', async () => {
    usersRepository.create(testUser)

    const { user } = await sut.execute({
      email: 'john@doe.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    usersRepository.create(testUser)

    expect(async () => {
      await sut.execute({
        email: 'jon@doe.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    usersRepository.create(testUser)

    expect(async () => {
      await sut.execute({
        email: 'jon@doe.com',
        password: '12456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
