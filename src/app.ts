import fastify from 'fastify'
import { appRoutes } from './http/route'

export const app = fastify()

app.register(appRoutes)
