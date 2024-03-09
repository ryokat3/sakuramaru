import { Either } from "fp-ts/lib/Either"
import { MapDataType } from "../../MapData"
import { AppConfig } from "../AppConfig"
import { GripType, TopStateType } from "./TopReducer"

export type TopFdt = {
    getMapData: (appConfig: AppConfig) => Promise<Either<unknown, MapDataType>>,
    getMap: (appConfig: AppConfig, fileName: string) => Promise<Either<unknown, { fileName: string, image:HTMLImageElement }>>,

    gripMap: GripType,
    ungripMap: void,
    moveMap: [number, number],
    selectMap: { fileName: string, overlap: TopStateType["overlap"] },
    switchSync: boolean,
    changeMapSize: [number, number]
}
