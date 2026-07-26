import z from "zod"
import { FastifyTypedInstance } from "./types.js"
import { randomUUID } from "node:crypto"

interface User {
    id: string
    name: string
    email: string
}

const users: User[] = []

export async function routes(app: FastifyTypedInstance) {

    app.get('/health', () => {
        return { status: 'ok' }
    })

    app.get('/', () => {
        return { message: 'A API está funcionando' }
    })

    app.get('/users', {
        schema: {
            tags: ['users'],
            description: 'Retorna uma lista de usuários',
            response: {
                200: z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                }))
            },
        },
    }, () => {
        return users
    })
    
    app.post('/users', {
        schema: {
            tags: ['users'],
            description: 'Cria um novo usuário',
            body: z.object({
                name: z.string(),
                email: z.email(),
            }),
            response: {
                201: z.null().describe('Usuário criado com sucesso'),
            },
        }
    }, async(request, reply) => {
        const { name, email } = request.body

        users.push({
            id: randomUUID(),
            name,
            email,
        })

        return reply.status(201).send(null)
    })
}