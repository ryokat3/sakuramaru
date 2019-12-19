import { createStore, combineReducers } from 'redux'
import { AppState, topStateReducer } from './state'

export const store = createStore(combineReducers<AppState>({
    topState: topStateReducer
}))