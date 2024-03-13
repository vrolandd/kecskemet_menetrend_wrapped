type Jarat = {
    jarat_id: number;
    indul: string;
    wifi: 0 | 1;
    alacsonypadlo: 0 | 1;
    online: 0 | 1;
    kimaradt: 0 | 1;
    ora: string;
    perc: string;
}

type Track = {
    vonal_id: number;
    vonal_nev: string;
    korjarat: 0 | 1;
}

type Route = {
    ora: string;
    utolso_ind_perc: string;
    van_online_jarat: number;

    jaratok: Jarat[];
}

type VehiclePosition = {
    utolso_megallo_id: string;
    utolso_megallo_sorszam: string;
    megalloban: 0 | 1;
    keses_sietes: string;
}

type Stop = {
    megallo_id: number;
    megallo_nev: string;
    sorrend: number;
    erkezesi_ido: string;
}

export type { Jarat, Route, VehiclePosition, Track, Stop }