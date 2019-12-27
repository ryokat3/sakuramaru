import * as React from "react"
import { useEffect} from "react"
import { useDispatch, useSelector } from "react-redux"
import { AsyncActionType } from "../../utils/reduxUtils"
import { createIpcRendererInvokeDispatcher } from "../../utils/ipcUtils"
import { TopStateType, TopActionType } from "../topState"
import { AppState } from "../appStore"

export interface AppContextType {
    appName: string
}

export const AppContext = React.createContext<AppContextType>({} as any)

export const Top: React.FunctionComponent<{}> = () => {
    const dispatch = useDispatch()
    const dispatcher = createIpcRendererInvokeDispatcher<AsyncActionType<TopActionType>>(dispatch, [ "getAppConfig" ])
    const state = useSelector((appState: AppState): TopStateType => ({ ...appState.topState }))

    useEffect(() => {
        dispatcher.getAppConfig()
    }, [])

    return <div><h1>{state.appConfig?.app.name}</h1></div>
}
