import { AppConfig } from "../../AppConfig"
import { MapInfoType } from "../../MapInfo"
import { Reducer } from "../../utils/IDLFlux"
import { TopIDL } from "./TopIDL"

export const initialTopState = {
    appConfig: undefined as AppConfig | undefined,
    mapInfo: undefined as MapInfoType | undefined,
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
    .add("getMapInfo", (state: TopStateType, mapInfo: MapInfoType) => {
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
