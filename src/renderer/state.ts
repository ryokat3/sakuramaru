import { reducerWithInitialState } from 'typescript-fsa-reducers'

export interface AppState {
    topState: typeof initialTopState    
}

const initialTopState = { }

export const topStateReducer = reducerWithInitialState(initialTopState)
