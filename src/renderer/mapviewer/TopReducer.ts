import { MapDataType } from "../../MapData"
import { Reducer } from "../../utils/IDLFlux"
import { TopIDL } from "./TopIDL"
import { defaultAppConfig } from "../AppConfig"


export const initialTopState = {
    appConfig: defaultAppConfig,
    mapInfo: Object.create(null) as MapDataType,
    selectedMap: undefined as string | undefined
}

export type TopStateType = typeof initialTopState

export const topReducer = new Reducer<TopIDL, TopStateType>()
    .add("getMapInfo", (state, response) => {
        return {
            ...state,
            mapInfo: response.payload
        }
    })
    .addError("getMapInfo", (state)=> {
        return state
    })
    .add("selectMap", (state, mapFile) => {
        return {
            ...state,
            selectedMap: mapFile
        }
    })
    .build()
