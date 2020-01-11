import { MapDataType } from "../../MapData"
import { RestIDL } from "../../utils/IDLRest"

export interface TopIDL {    
    getMapInfo: (mapInfoPath:string) => RestIDL<MapDataType> ,
    getMap:(fileName:string) => Promise<Blob>

    selectMap: string
}
