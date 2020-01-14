import { MapDataType } from "../../MapData"
import { Reducer } from "../../utils/IDLFlux"
import { defaultAppConfig } from "../AppConfig"
import { TopIDL } from "./TopIDL"

export const initialTopState = {
    appConfig: defaultAppConfig,
    mapInfo: Object.create(null) as MapDataType,
    mapBlob: Object.create(null) as { [fileName: string]: Blob },
    selectedMap: undefined as string | undefined
}

export type TopStateType = typeof initialTopState

export const topReducer = new Reducer<TopIDL, TopStateType>()
    .add("getMapInfo", (state, mapInfo) => {
        return {
            ...state,
            mapInfo
        }
    })
    .addError("getMapInfo", (state) => {
        return state
    })
    .add("getMap", (state, mapBlob) => {
        return {
            ...state,
            mapBlob: {
                ...state.mapBlob,
                [mapBlob.fileName]: mapBlob.blob
            }
        }
    })
    .add("selectMap", (state, mapFile) => {
        return {
            ...state,
            selectedMap: mapFile
        }
    })
    .build()
