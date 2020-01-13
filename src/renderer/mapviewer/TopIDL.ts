import { MapDataType } from "../../MapData"
import { RestIDL } from "../../utils/restTaskEither"
import { AppConfig } from "../AppConfig"

export interface TopIDL {    
    getMapInfo: (appConfig:AppConfig) => RestIDL<MapDataType> ,
    getMap:(appConfig:AppConfig, fileName:string) => Promise<Blob>

    selectMap: string
}
