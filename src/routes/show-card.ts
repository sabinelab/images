import { getPlayers } from '@sabinelab/players'
import { Elysia, NotFoundError, t } from 'elysia'
import sharp, { type OverlayOptions } from 'sharp'
import { config, type Key } from '../config'

const players = new Set(getPlayers().map((p) => p.id))
sharp.concurrency(1)
sharp.cache(true)

export const showCard = new Elysia().get(
  '/show',
  async ({ query, set, request }) => {
    try {
      const url = new URL(request.url)
      const params = url.searchParams
      params.sort()

      const rawBuffer = await Bun.redis.getBuffer(`card:${params.toString()}`)

      if (rawBuffer) {
        set.headers['content-type'] = 'image/png'
        return rawBuffer
      }

      if (!players.has(query.id)) {
        throw new NotFoundError('Unknown card')
      }

      const base = sharp(`assets/cards/${query.id}.png`)

      if (
        query.collection.toLowerCase().startsWith('valorant') ||
        query.collection.toLowerCase().startsWith('vct') ||
        query.collection.toLowerCase() === 'base card' ||
        query.collection.toLowerCase() === 'eternal heroes'
      ) {
        let collection: Key

        if (query.collection.toLowerCase().startsWith('valorant masters')) {
          collection = 'valorant masters'
        } else if (
          query.collection.toLowerCase().startsWith('valorant champions')
        ) {
          collection = 'valorant champions'
        } else if (query.collection.toLowerCase().includes('lock//in')) {
          collection = 'lockin'
        } else collection = query.collection.toLowerCase() as Key

        const overlays: OverlayOptions[] = [
          {
            input: `assets/roles/${collection}/${query.role}.png`,
            left: config.overlay[collection].role.left,
            top: config.overlay[collection].role.top
          },
          {
            input: await sharp(`assets/countries/${query.country}.png`)
              .resize(150, 150)
              .toBuffer(),
            top: config.overlay[collection].country.top,
            left: config.overlay[collection].country.left
          },
          {
            input: await sharp(`assets/teams/${query.team}.png`)
              .resize(150, 150)
              .toBuffer(),
            top: config.overlay[collection].team.top,
            left: config.overlay[collection].team.left
          },
          {
            input: `assets/stats/${collection}/aim.png`,
            top: config.overlay[collection].stats.aim.top,
            left: config.overlay[collection].stats.aim.left
          },
          {
            input: `assets/stats/${collection}/hs.png`,
            top: config.overlay[collection].stats.hs.top,
            left: config.overlay[collection].stats.hs.left
          },
          {
            input: `assets/stats/${collection}/movement.png`,
            top: config.overlay[collection].stats.movement.top,
            left: config.overlay[collection].stats.movement.left
          },
          {
            input: `assets/stats/${collection}/aggression.png`,
            top: config.overlay[collection].stats.aggression.top,
            left: config.overlay[collection].stats.aggression.left
          },
          {
            input: `assets/stats/${collection}/acs.png`,
            top: config.overlay[collection].stats.acs.top,
            left: config.overlay[collection].stats.acs.left
          },
          {
            input: `assets/stats/${collection}/gamesense.png`,
            top: config.overlay[collection].stats.gamesense.top,
            left: config.overlay[collection].stats.gamesense.left
          }
        ]

        const ovr = Math.floor(query.ovr).toString()

        let left: number = config.ovr[collection].left
        const sum = 65

        if (ovr.length === 3) {
          left -= 25
        }

        for (const i in ovr.split('')) {
          left += sum + 20

          const n = ovr[i]

          overlays.push({
            input: `assets/numbers/${collection}/ovr/${n}.png`,
            top: config.ovr[collection].top,
            left
          })
        }

        const aim = Math.floor(query.aim).toString()
        const hs = Math.floor(query.hs).toString()
        const mov = Math.floor(query.movement).toString()
        const agg = Math.floor(query.aggression).toString()
        const acs = Math.floor(query.acs).toString()
        const gms = Math.floor(query.gamesense).toString()

        left = config.stats[collection].aim.left

        if (aim.length === 3) {
          left -= 60
        }

        for (const i in aim.split('')) {
          left += sum

          const n = aim[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].aim.top,
            left
          })
        }

        left = config.stats[collection].hs.left

        if (hs.length === 3) {
          left -= 60
        }

        for (const i in hs.split('')) {
          left += sum

          const n = hs[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].hs.top,
            left
          })
        }

        left = config.stats[collection].movement.left

        if (mov.length === 3) {
          left -= 60
        }

        for (const i in mov.split('')) {
          left += sum

          const n = mov[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].movement.top,
            left
          })
        }

        left = config.stats[collection].aggression.left

        if (agg.length === 3) {
          left -= 15
        }

        for (const i in agg.split('')) {
          left += sum

          const n = agg[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].aggression.top,
            left
          })
        }

        left = config.stats[collection].acs.left

        if (acs.length === 3) {
          left -= 15
        }

        for (const i in acs.split('')) {
          left += sum

          const n = acs[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].acs.top,
            left
          })
        }

        left = config.stats[collection].gamesense.left

        if (gms.length === 3) {
          left -= 15
        }

        for (const i in gms.split('')) {
          left += sum

          const n = gms[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].gamesense.top,
            left
          })
        }

        const buffer = await base.composite(overlays).png().toBuffer()
        Bun.redis
          .set(`card:${params.toString()}`, buffer, 'EX', 43200)
          .catch(null)

        set.headers['content-type'] = 'image/png'
        return buffer
      } else {
        const base = sharp(`assets/cards/${query.id}.png`)

        let collection: Key

        if (query.collection.toLowerCase().startsWith('masters')) {
          collection = 'masters' as Key
        } else if (query.collection.toLowerCase().startsWith('champions')) {
          collection = 'champions' as Key
        } else if (query.collection.toLowerCase().startsWith('triple crown')) {
          collection = 'triple crown' as Key
        } else collection = query.collection.toLowerCase() as Key

        if (!config.overlay[collection]) {
          collection = 'base'
        }

        const overlays: OverlayOptions[] = [
          {
            input: `assets/roles/${collection}/${query.role}.png`,
            left:
              config.overlay[collection].role.left +
              (query.role === 'initiator' ? 20 : 0),
            top: config.overlay[collection].role.top
          },
          {
            input: `assets/countries/${query.country}.png`,
            top: config.overlay[collection].country.top,
            left: config.overlay[collection].country.left
          },
          {
            input: await sharp(`assets/teams/${query.team}.png`)
              .resize(100, 100)
              .toBuffer(),
            top: config.overlay[collection].team.top,
            left: config.overlay[collection].team.left
          },
          {
            input: `assets/stats/${collection}/aim.png`,
            top: config.overlay[collection].stats.aim.top,
            left: config.overlay[collection].stats.aim.left
          },
          {
            input: `assets/stats/${collection}/hs.png`,
            top: config.overlay[collection].stats.hs.top,
            left: config.overlay[collection].stats.hs.left
          },
          {
            input: `assets/stats/${collection}/movement.png`,
            top: config.overlay[collection].stats.movement.top,
            left: config.overlay[collection].stats.movement.left
          },
          {
            input: `assets/stats/${collection}/aggression.png`,
            top: config.overlay[collection].stats.aggression.top,
            left: config.overlay[collection].stats.aggression.left
          },
          {
            input: `assets/stats/${collection}/acs.png`,
            top: config.overlay[collection].stats.acs.top,
            left: config.overlay[collection].stats.acs.left
          },
          {
            input: `assets/stats/${collection}/gamesense.png`,
            top: 260,
            left: 65
          }
        ]

        const ovr = Math.floor(query.ovr).toString()

        let left: number = config.ovr[collection].left

        if (ovr.length === 3) {
          left -= 25
        }

        for (const i in ovr.split('')) {
          left += 40

          const n = ovr[i]

          overlays.push({
            input: `assets/numbers/${collection}/ovr/${n}.png`,
            top: config.ovr[collection].top,
            left
          })
        }

        const aim = Math.floor(query.aim).toString()
        const hs = Math.floor(query.hs).toString()
        const mov = Math.floor(query.movement).toString()
        const agg = Math.floor(query.aggression).toString()
        const acs = Math.floor(query.acs).toString()
        const gms = Math.floor(query.gamesense).toString()

        left = config.stats[collection].aim.left

        if (aim.length === 3) {
          left -= 20
        }

        for (const i in aim.split('')) {
          left += 30

          const n = aim[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].aim.top,
            left
          })
        }

        left = config.stats[collection].hs.left

        for (const i in hs.split('')) {
          const n = hs[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].hs.top,
            left: i === '0' ? left : left + 30
          })
        }

        left = config.stats[collection].movement.left

        if (mov.length === 3) {
          left -= 20
        }

        for (const i in mov.split('')) {
          left += 30

          const n = mov[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].movement.top,
            left
          })
        }

        left = config.stats[collection].aggression.left

        if (agg.length === 3) {
          left -= 15
        }

        for (const i in agg.split('')) {
          left += 30

          const n = agg[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].aggression.top,
            left
          })
        }

        left = config.stats[collection].acs.left

        if (acs.length === 3) {
          left -= 15
        }

        for (const i in acs.split('')) {
          left += 30

          const n = acs[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].acs.top,
            left
          })
        }

        left = config.stats[collection].gamesense.left

        if (gms.length === 3) {
          left -= 15
        }

        for (const i in gms.split('')) {
          left += 30

          const n = gms[i]

          overlays.push({
            input: `assets/numbers/${collection}/stats/${n}.png`,
            top: config.stats[collection].gamesense.top,
            left
          })
        }

        const buffer = await base.composite(overlays).png().toBuffer()
        Bun.redis
          .set(`card:${params.toString()}`, buffer, 'EX', 43200)
          .catch(null)

        set.headers['content-type'] = 'image/png'
        return buffer
      }
    } catch (e) {
      if (e instanceof NotFoundError) {
        set.status = 'Not Found'
        return { error: 'Unknown card' }
      } else if (e instanceof Error) {
        set.status = 'Internal Server Error'
        return { error: e.message }
      }
    }
  },
  {
    query: t.Object({
      id: t.Numeric(),
      collection: t.String(),
      country: t.String(),
      team: t.String(),
      role: t.Enum({
        controller: 'controller',
        duelist: 'duelist',
        flex: 'flex',
        initiator: 'initiator',
        sentinel: 'sentinel'
      }),
      aim: t.Numeric(),
      hs: t.Numeric(),
      movement: t.Numeric(),
      aggression: t.Numeric(),
      acs: t.Numeric(),
      gamesense: t.Numeric(),
      ovr: t.Numeric()
    })
  }
)
