import { AppConfig } from "../../appConfig"
import { Reducer } from "../../utils/IDLFlux"
import { TopActionType } from "./topAction"

export const initialTopState = {
    appConfig: undefined as AppConfig | undefined
}

export type TopStateType = typeof initialTopState

export const topReducer = new Reducer<TopActionType, TopStateType>()
    .add("getAppConfig", (state: typeof initialTopState, appConfig: AppConfig) => {
        return {
            ...state,
            appConfig
        }
    })
    .build()
