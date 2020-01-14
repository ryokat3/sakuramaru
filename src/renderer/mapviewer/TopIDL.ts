import { MapDataType } from "../../MapData"
import { SuccessOrError } from "../../utils/IDL"
import { AppConfig } from "../AppConfig"

export interface TopIDL {
    getMapInfo: (appConfig: AppConfig) => Promise<SuccessOrError<MapDataType, unknown>> ,
    getMap: (appConfig: AppConfig, fileName: string) => Promise<SuccessOrError<{ fileName: string, blob: Blob }, unknown>>

    selectMap: string
}
