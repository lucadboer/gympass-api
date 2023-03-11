import { PrismaUserRepository } from '@/repositories/prisma-users-repository'
import { UserAlreadyExistError } from '@/services/errors/user-already-exist-error'
import { RegisterService } from '@/services/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUserRepository()
    const registerMember = new RegisterService(usersRepository)

    await registerMember.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistError) {
      return reply.status(409).send({ message: error.message })
    }

    return reply.status(500).send() // TODO fix me
  }

  return reply.status(201).send()
}
