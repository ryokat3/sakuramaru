import * as React from "react"
import { useEffect} from "react"
import { topDispatcher } from "./topDispatcher"
import { initialTopState, topReducer } from "./topReducer"

export const Top: React.FunctionComponent<{}> = () => {
    const [state, dispatch] = React.useReducer(topReducer, initialTopState)
    const dispatcher = topDispatcher.build(dispatch)

    useEffect(() => {
        dispatcher.getAppConfig()
    }, [])

    return <div><h1>{state.appConfig?.app.name}</h1></div>
}
