const BERJESS_OVERLOOK = {
    id: 400130,
    location_x: -2032.33,
    location_z: -92.78,
}

const SUNKEN_RELAY_STATION = {
    id: 400131,
    location_x: 1423.7,
    location_z: 2631.84,
}

const LOWLAND_TRADING_POST = {
    id: 400132,
    location_x: 601.596,
    location_z: -2408.15,
}

interface IndarConstructionOutpostInterface {
    id: number,
    location_x: number,
    location_z: number
}

const getIndarConstructionOutpost = (id: number): IndarConstructionOutpostInterface | null => {
    if(id == LOWLAND_TRADING_POST.id){
        return LOWLAND_TRADING_POST;
    } else if (id == SUNKEN_RELAY_STATION.id){
        return SUNKEN_RELAY_STATION;
    } else if (id == BERJESS_OVERLOOK.id){
        return BERJESS_OVERLOOK;
    }
    return null;
}

export default getIndarConstructionOutpost