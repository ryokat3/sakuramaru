import { Action } from 'typescript-fsa'
import { Dispatch } from 'redux'    
import { AppState } from "./state"

export interface AppDispatch {

}

export function mapDispatchToProps(dispatch:Dispatch<Action<unknown>>):AppDispatch {
    return {}    
}

export function mapStateToProps(appState:AppState) { return { ...appState } }


