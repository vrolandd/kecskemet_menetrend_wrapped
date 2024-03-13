import axios, { AxiosResponse } from 'axios';
import { Route } from './types';

const finaliseNumber = (num: number): string => {
    if (num < 10) {
        return '0' + num;
    } else {
        return num.toString();
    }
}

function GetTracks() {
    const d = new Date();
    
    return axios.get(`https://menetrend.kecskemet.hu/api/api/tracks/${finaliseNumber(d.getFullYear())}${finaliseNumber(d.getMonth() + 1)}${finaliseNumber(d.getDate())}`)
}

async function GetTrack(id: string, korjarat: boolean) {
    const d = new Date();

    let a: Route[] = []

    a.push(...(await axios.get(`https://menetrend.kecskemet.hu/api/api/routes/${finaliseNumber(d.getFullYear())}${finaliseNumber(d.getMonth() + 1)}${finaliseNumber(d.getDate())}/${id}/1`)).data)
    
    if (!korjarat) {
        a.push(...(await axios.get(`https://menetrend.kecskemet.hu/api/api/routes/${finaliseNumber(d.getFullYear())}${finaliseNumber(d.getMonth() + 1)}${finaliseNumber(d.getDate())}/${id}/2`)).data)
    }



    return a
}

function GetStops(id: string) {
    const d = new Date();
    
    return axios.get(`https://menetrend.kecskemet.hu/api/api/path/${finaliseNumber(d.getFullYear())}${finaliseNumber(d.getMonth() + 1)}${finaliseNumber(d.getDate())}/${id}`)
}

async function GetVehiclePosition(id: string) {
    const d = new Date();

    let a: AxiosResponse
    let res = false;

    while (res == false) {
        try {
            a = await axios.get(`https://menetrend.kecskemet.hu/api/api/vehicleposition/${finaliseNumber(d.getFullYear())}${finaliseNumber(d.getMonth() + 1)}${finaliseNumber(d.getDate())}/${id}`)
            res = true;
        } catch(e) {
        }
    }

    return a;
}


export { GetTracks, GetTrack, GetStops, GetVehiclePosition }