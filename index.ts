import { GetStops, GetTrack, GetTracks, GetVehiclePosition } from './requests'
import { Jarat, Route, Stop, Track, VehiclePosition } from './types';

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '192.168.0.101',
    password: 'root',
    user: 'root',
    database: 'kecskemet_menetrend',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 120000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

async function main() {
    let currentTime = new Date();
    let ejfelig = new Date(`${currentTime.getFullYear()}. ${ currentTime.getMonth() + 1 }. ${ currentTime.getDate() + 1 }. 00:04`);

    // setTimeout(() => {
        const tracksToday = (await GetTracks()).data as Track[];

        for (let Track of tracksToday) {
            const Routes = (await GetTrack(Track.vonal_id.toString(), Track.korjarat == 1)) as Route[];

            for (let Routee of Routes) {
                for (let Route of Routee.jaratok) {
                    if (new Date(`${currentTime.getFullYear()}. ${ currentTime.getMonth() + 1 }. ${currentTime.getDate()}. ${ Route.ora }:${ Route.perc }`).getTime() > new Date().getTime()) {
                        console.log(`Waiting for ${ Track.vonal_id }, which starts at ${ Route.ora }:${ Route.perc }`)
                        setTimeout(async() => {
                            console.log(`Line ${ Track.vonal_id } started at (${ Route.ora }:${ Route.perc }) (${ new Date().getHours() }:${ new Date().getMinutes() })`)
                            const Stops = (await GetStops(Route.jarat_id.toString())).data as Stop[];
    
                            let keses_sietes = Stops.map(() => 0);
    
                            let a = setInterval(async() => {
                                let curr = (await GetVehiclePosition(Route.jarat_id.toString())).data as VehiclePosition;
                                curr = curr[0]

                                try {
                                    if (parseInt(curr.utolso_megallo_sorszam) == Stops.length) {
                                        clearInterval(a)
                                        console.log(`Line ${ Track.vonal_id } ended, being ${ keses_sietes.reduce(function (a, b) { return a + b; }, 0) }`)
                                    } else {
                                        console.log(`Line ${ Track.vonal_id } started at (${ Route.ora }:${ Route.perc }) is being ${keses_sietes[parseInt(curr.utolso_megallo_sorszam) - 1]} secs late.`)
                                        keses_sietes[parseInt(curr.utolso_megallo_sorszam) - 1] = parseInt(curr.keses_sietes);

                                        const l = await pool.query(`SELECT COUNT(*) as count FROM kesesek WHERE jarat_id = ? AND megallo_id = ?`, [ Track.vonal_id, Stops[parseInt(curr.utolso_megallo_sorszam) - 1].megallo_id ]) as any
                                        
                                        if (l[0][0].count == 0) {
                                            pool.query('INSERT INTO `kesesek` (jarat_id, jarat_nev, megallo_id, megallo_nev, keses) VALUES(?, ?, ?, ?, ?)', [
                                                Route.jarat_id, Track.vonal_id, Stops[parseInt(curr.utolso_megallo_sorszam) - 1].megallo_id, Stops[parseInt(curr.utolso_megallo_sorszam) - 1].megallo_nev, parseInt(curr.keses_sietes)
                                            ])
                                        } else {
                                            pool.query('UPDATE `kesesek` SET keses = ? WHERE jarat_id = ? AND megallo_id = ?', [
                                                Route.jarat_id, Stops[parseInt(curr.utolso_megallo_sorszam) - 1].megallo_id, parseInt(curr.keses_sietes)
                                            ])
                                        }
                                    }
                                } catch(e) {
                                    console.log("E, Source: " + Track.vonal_id, '\n', curr)
                                }
                            }, 10000)
                        }, new Date(`${currentTime.getFullYear()}. ${ currentTime.getMonth() + 1 }. ${ currentTime.getDate() } ${ Route.indul }`).getTime() - new Date().getTime())
                    }
                }
            }
        }

    // }, ejfelig.getTime() - currentTime.getTime())


    // console.log((await GetTracks()))
}

main();