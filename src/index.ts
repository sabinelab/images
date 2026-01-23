import { Elysia } from 'elysia'
import { getCard } from './routes/get-card'
import { showCard } from './routes/show-card'

new Elysia()
  .get('/', { message: 'Hello, world!' })
  .use(getCard)
  .use(showCard)
  .listen(8000)

console.log(`HTTP server running at 8000`)
