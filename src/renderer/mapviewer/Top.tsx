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
    },
    mapViewer: {
        objectFit: "none"
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
        dispatcher.getMapInfo(state.appConfig)
    }, [])

    useEffect(() => {
      	if (state.selectedMap !== undefined) {
			dispatcher.getMap(state.appConfig, state.selectedMap)
		}
    }, [ state.selectedMap ])

    const context = {
        dispatcher,
        style
    }

    const mapStyle = {
        width: 100,
        height: 400        
    }    

    return <TopContext.Provider value={context}>
        <div><h1>{state.appConfig.name}</h1></div>
        <MapSelector mapData={state.mapInfo} mapFile={state.selectedMap}></MapSelector>
        <img className={style.mapViewer} src={state.appConfig.mapDir + "/" + state.selectedMap} style={mapStyle}/>
    </TopContext.Provider>
}
