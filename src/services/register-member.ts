import { UserRepository } from './../repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterMember {
  constructor(private usersRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest) {
    const passwordHash = await hash(password, 6)

    const isEmailAreadyExist = await this.usersRepository.findByEmail(email)

    if (isEmailAreadyExist) {
      throw new Error('Email already exists')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
