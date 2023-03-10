import { InMemmoryUserRepository } from '@/repositories/in-memmory/in-memmory-user-repositry'
import { describe, expect, it } from 'vitest'
import { RegisterMember } from './register-member'

describe('Register Service', () => {
  it('should be able to create a new user', async () => {
    const usersRepository = new InMemmoryUserRepository()
    const register = new RegisterMember(usersRepository)

    const user = await register.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })
]  })
})
