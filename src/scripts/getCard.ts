import { Elysia } from 'elysia'
import constants from 'node:constants'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

export const getCard = new Elysia()
  .get('/cards/:id', async({ params, set }) => {
    const cardPath = path.resolve('output', params.id)

    try {
      await access(cardPath, constants.R_OK)

      const buffer = await readFile(cardPath)

      set.headers['content-type'] = 'image/png'

      return buffer
    }

    catch(e) {
      if(!(e instanceof Error)) {
        console.error(e)
      }

      set.status = 404

      return { error: 'Unknown card' }
    }
  })