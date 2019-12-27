import { createStore, combineReducers } from "redux"
import { TopStateType, topStateReducer } from "./topState"

export interface AppState {    
    topState: TopStateType
}

export const appStore = createStore(combineReducers<AppState>({
    topState: topStateReducer
}))