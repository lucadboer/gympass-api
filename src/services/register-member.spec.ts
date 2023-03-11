import { InMemmoryUserRepository } from '@/repositories/in-memmory/in-memmory-user-repositry'
import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { UserAlreadyExistError } from './errors/user-already-exist-error'
import { RegisterMember } from './register-member'

describe('Register Service', () => {
  it('should be able to create a new user', async () => {
    const usersRepository = new InMemmoryUserRepository()
    const register = new RegisterMember(usersRepository)

    const { user } = await register.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to create with same email', async () => {
    const usersRepository = new InMemmoryUserRepository()
    const register = new RegisterMember(usersRepository)

    await register.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(async () => {
      await register.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should be able to create password hash correctly', async () => {
    const usersRepository = new InMemmoryUserRepository()
    const register = new RegisterMember(usersRepository)

    const { user } = await register.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })
    const isCorrectlyHashed = await compare('123456', user.password_hash)

    expect(isCorrectlyHashed).toBe(true)
  })
})
