import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { createContext, useEffect } from "react"
import { MapSelector } from "./MapSelector"
import { topDispatcher, TopDispatcherType } from "./TopDispatcher"
import { initialTopState, topReducer } from "./TopReducer"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  })
)

export interface TopContextType {
    dispatcher: TopDispatcherType
    style: ReturnType<typeof useStyles>
}

export const TopContext = createContext<TopContextType>(Object.create(null))

export const Top: React.FunctionComponent<{}> = () => {
    const [state, dispatch] = React.useReducer(topReducer, initialTopState)
    const dispatcher = topDispatcher.build(dispatch)
    const style = useStyles()

    useEffect(() => {
        dispatcher.getAppConfig()
        dispatcher.getMapInfo()
    }, [])

    const context = {
        dispatcher,
        style
    }

    return <TopContext.Provider value={context}>
        <div><h1>{state.appConfig?.app.name}</h1></div>
        <MapSelector mapData={state.mapInfo} mapFile={state.mapFile}></MapSelector>
    </TopContext.Provider>
}
