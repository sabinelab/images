import { Elysia } from 'elysia'
import { getCard } from './routes/get-card'

new Elysia()
  .get('/', { message: 'Hello, world!' })
  .use(getCard)
  .listen(8000)

console.log(`HTTP server running at 8000`)
