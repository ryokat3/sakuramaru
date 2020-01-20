import { MapDataType } from "../../MapData"
import { Payload } from "../../utils/Fdt"
import { AppConfig } from "../AppConfig"
import { GripType } from "./TopReducer"


export type TopIDL = {
    getMapInfo: (appConfig: AppConfig) => Promise<Payload<MapDataType, unknown>>,
    getMap: (appConfig: AppConfig, fileName: string) => Promise<Payload<{ fileName: string, blob: Blob }, unknown>>,
    
    gripMap: Payload<GripType>,
    ungripMap: Payload<void>,
    moveMap: Payload<[number, number]>,
    selectMap: Payload<string>,
    switchSync: Payload<boolean>
}
