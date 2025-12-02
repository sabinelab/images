import sharp from 'sharp'
import fs from 'node:fs'
import { getPlayers } from '@sabinelab/players'
import { config, type Key } from '../config.ts'

const started = Date.now()

console.log('generating cards...')

if(!fs.existsSync('output')) {
    fs.mkdirSync('output')
}

const promises: Promise<sharp.OutputInfo>[] = []

for(const player of getPlayers()) {
    const base = sharp(`assets/cards/${player.id}.png`)

    if(
        player.collection.toLowerCase().startsWith('valorant') ||
        player.collection.toLowerCase().startsWith('vct') ||
        player.collection.toLowerCase() === 'base card'
    ) {
        let collection: Key

        if(player.collection.toLowerCase().startsWith('valorant masters')) {
            collection = 'valorant masters'
        }
        else if(player.collection.toLowerCase().startsWith('valorant champions')) {
            collection = 'valorant champions'
        }
        else if(player.collection.toLowerCase().includes('lock//in')) {
            collection = 'lockin'
        }
        else collection = player.collection.toLowerCase() as Key

        const overlays: sharp.OverlayOptions[] = [
            {
                input: `assets/roles/${collection}/${player.role}.png`,
                left: config.overlay[collection].role.left,
                top: config.overlay[collection].role.top
            },
            {
                input: await sharp(`assets/countries/${player.country}.png`).resize(150, 150).toBuffer(),
                top: config.overlay[collection].country.top,
                left: config.overlay[collection].country.left
            },
            {
                input: await sharp(`assets/teams/${player.team}.png`).resize(250, 250).toBuffer(),
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

        const ovr = Math.floor(player.ovr).toString()

        let left: number = config.ovr[collection].left
        const sum = 65

        if(ovr.length === 3) {
            left -= 25
        }

        for(const i in ovr.split('')) {
            left += sum + 20

            const n = ovr[i]

            overlays.push({
                input: `assets/numbers/${collection}/ovr/${n}.png`,
                top: config.ovr[collection].top,
                left
            })
        }

        const aim = Math.floor(player.aim).toString()
        const hs = Math.floor(player.HS).toString()
        const mov = Math.floor(player.movement).toString()
        const agg = Math.floor(player.aggression).toString()
        const acs = Math.floor(player.ACS).toString()
        const gms = Math.floor(player.gamesense).toString()

        left = config.stats[collection].aim.left

        if(aim.length === 3) {
            left -= 20
        }

        for(const i in aim.split('')) {
            left += sum

            const n = aim[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].aim.top,
                left
            })
        }

        left = config.stats[collection].hs.left

        for(const i in hs.split('')) {
            left += sum

            const n = hs[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].hs.top,
                left
            })
        }

        left = config.stats[collection].movement.left

        if(mov.length === 3) {
            left -= 20
        }

        for(const i in mov.split('')) {
            left += sum

            const n = mov[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].movement.top,
                left
            })
        }

        left = config.stats[collection].aggression.left

        if(agg.length === 3) {
            left -= 15
        }

        for(const i in agg.split('')) {
            left += sum

            const n = agg[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].aggression.top,
                left
            })
        }

        left = config.stats[collection].acs.left

        if(acs.length === 3) {
            left -= 15
        }

        for(const i in acs.split('')) {
            left += sum

            const n = acs[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].acs.top,
                left
            })
        }

        left = config.stats[collection].gamesense.left

        if(gms.length === 3) {
            left -= 15
        }

        for(const i in gms.split('')) {
            left += sum

            const n = gms[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].gamesense.top,
                left
            })
        }

        promises.push(base.composite(overlays).toFile(`output/${player.id}.png`))
    }

    else {
        const base = sharp(`assets/cards/${player.id}.png`)

        let collection: Key

        if(player.collection.toLowerCase().startsWith('masters')) {
            collection = 'masters' as Key
        }

        else if(player.collection.toLowerCase().startsWith('champions')) {
            collection = 'champions' as Key
        }

        else if(player.collection.toLowerCase().startsWith('triple crown')) {
            collection = 'triple crown' as Key
        }

        else collection = player.collection.toLowerCase() as Key

        if(!config.overlay[collection]) {
            collection = 'base'
        }

        const overlays: sharp.OverlayOptions[] = [
            {
                input: `assets/roles/${collection}/${player.role}.png`,
                left: config.overlay[collection].role.left + (player.role === 'initiator' ? 20 : 0),
                top: config.overlay[collection].role.top
            },
            {
                input: `assets/countries/${player.country}.png`,
                top: config.overlay[collection].country.top,
                left: config.overlay[collection].country.left
            },
            {
                input: await sharp(`assets/teams/${player.team}.png`).resize(100, 100).toBuffer(),
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

        const ovr = Math.floor(player.ovr).toString()

        let left: number = config.ovr[collection].left

        if(ovr.length === 3) {
            left -= 25
        }

        for(const i in ovr.split('')) {
            left += 40

            const n = ovr[i]

            overlays.push({
                input: `assets/numbers/${collection}/ovr/${n}.png`,
                top: config.ovr[collection].top,
                left
            })
        }

        const aim = Math.floor(player.aim).toString()
        const hs = Math.floor(player.HS).toString()
        const mov = Math.floor(player.movement).toString()
        const agg = Math.floor(player.aggression).toString()
        const acs = Math.floor(player.ACS).toString()
        const gms = Math.floor(player.gamesense).toString()

        left = config.stats[collection].aim.left

        if(aim.length === 3) {
            left -= 20
        }

        for(const i in aim.split('')) {
            left += 30

            const n = aim[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].aim.top,
                left
            })
        }

        left = config.stats[collection].hs.left

        for(const i in hs.split('')) {
            const n = hs[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].hs.top,
                left: i === '0' ? left : left + 30
            })
        }

        left = config.stats[collection].movement.left

        if(mov.length === 3) {
            left -= 20
        }

        for(const i in mov.split('')) {
            left += 30

            const n = mov[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].movement.top,
                left
            })
        }

        left = config.stats[collection].aggression.left

        if(agg.length === 3) {
            left -= 15
        }

        for(const i in agg.split('')) {
            left += 30

            const n = agg[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].aggression.top,
                left
            })
        }

        left = config.stats[collection].acs.left

        if(acs.length === 3) {
            left -= 15
        }

        for(const i in acs.split('')) {
            left += 30

            const n = acs[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].acs.top,
                left
            })
        }

        left = config.stats[collection].gamesense.left

        if(gms.length === 3) {
            left -= 15
        }

        for(const i in gms.split('')) {
            left += 30

            const n = gms[i]

            overlays.push({
                input: `assets/numbers/${collection}/stats/${n}.png`,
                top: config.stats[collection].gamesense.top,
                left
            })
        }

        promises.push(base.composite(overlays).toFile(`output/${player.id}.png`))
    }
}

await Promise.allSettled(promises)

console.log(`cards generated in ${((Date.now() - started) / 1000).toFixed(1)}s`)