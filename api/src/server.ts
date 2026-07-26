import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import {fastifySwagger} from '@fastify/swagger'
import {fastifyCors} from '@fastify/cors'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { routes } from './routes.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE', 'OPTIONS'],
  // credentials: true,
})
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Suplos API',
      description: 'API para Suplos',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})
  
app.register(routes)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log("👌👌 Servidor rodando em http://localhost:3333")
  console.log("📚 Documentos disponíveis em http://localhost:3333/docs")
})
