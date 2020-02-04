import { MapDataType } from "../../MapData"
import { Payload } from "../../utils/Fdt"
import { AppConfig } from "../AppConfig"
import { GripType, TopStateType } from "./TopReducer"

export type TopFdt = {
    getMapData: (appConfig: AppConfig) => Promise<Payload<MapDataType, unknown>>,
    getMap: (appConfig: AppConfig, fileName: string) => Promise<Payload<{ fileName: string, image:HTMLImageElement }, unknown>>,

    gripMap: Payload<GripType>,
    ungripMap: Payload<void>,
    moveMap: Payload<[number, number]>,
    selectMap: Payload<{ fileName: string, overlap: TopStateType['overlap'] }>,
    switchSync: Payload<boolean>,
    changeMapSize: Payload<[number, number]>,
}
