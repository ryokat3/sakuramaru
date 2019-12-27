import * as React from "react"
import { useEffect} from "react"
import { AsyncActionType } from "../../utils/fluxUtils"
import { createIpcRendererInvokeDispatcher } from "../../utils/ipcUtils"
import { TopActionType, topStateReducer, initialTopState } from "./topState"

export const Top: React.FunctionComponent<{}> = () => {  
    const [state, dispatch] = React.useReducer(topStateReducer, initialTopState)         
    const dispatcher = createIpcRendererInvokeDispatcher<AsyncActionType<TopActionType>>(dispatch, [ "getAppConfig" ])
    
    useEffect(() => {
        dispatcher.getAppConfig()
    }, [])

    return <div><h1>{state.appConfig?.app.name}</h1></div>
}
