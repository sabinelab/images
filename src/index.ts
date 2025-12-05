import { Elysia } from 'elysia'
import { getCard } from './scripts/getCard.ts'

new Elysia()
  .get('/', { message: 'Hello, world!' })
  .use(getCard)
  .listen(process.env.PORT)

console.log(`HTTP server running at ${process.env.PORT}`)