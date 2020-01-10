import { AppConfig } from "../../AppConfig"
import { MapDataType } from "../../MapData"
import { Reducer } from "../../utils/IDLFlux"
import { TopIDL } from "./TopIDL"

export const initialTopState = {
    appConfig: undefined as AppConfig | undefined,
    mapInfo: Object.create(null) as MapDataType,
    mapFile: undefined as string | undefined
}

export type TopStateType = typeof initialTopState

export const topReducer = new Reducer<TopIDL, TopStateType>()
    .add("getAppConfig", (state: typeof initialTopState, appConfig: AppConfig) => {
        return {
            ...state,
            appConfig
        }
    })
    .add("getMapInfo", (state: TopStateType, mapInfo: MapDataType) => {
        return {
            ...state,
            mapInfo
        }
    })
    .add("selectMap", (state: TopStateType, mapFile: string) => {
        return {
            ...state,
            mapFile
        }
    })
    .build()
