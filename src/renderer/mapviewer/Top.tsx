import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { createContext, useEffect } from "react"
import { MapData } from "./MapData"
import { MapPoints } from "./MapPoints"
import { MapSelector } from "./MapSelector"
import { MapSyncSwiitch } from "./MapSyncSwitch"
import { MapViewer } from "./MapViewer"
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
        display: "inline-block"
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
        dispatcher.getMapData(state.appConfig)
    }, [])

    useEffect(() => {
        const preventDefault = (e: TouchEvent) => { e.preventDefault() }
        if (state.grip !== "none") {
            document.addEventListener("touchmove", preventDefault, { passive: false})
        }
        return () => {
            document.removeEventListener("touchmove", preventDefault)
        }
    }, [ state.grip ])

    const context = {
        dispatcher,
        style
    }

    return <TopContext.Provider value={context}>
        <div><h1>{state.appConfig.name}</h1></div>
        <MapSelector mapData={state.mapData} mapFile={state.selectedMap}></MapSelector>
        <div>
            <MapViewer id={"left"}
                mapFile={(state.selectedMap !== undefined) ? state.appConfig.mapDir + "/" + state.mapData.maps[state.selectedMap].leftMap?.fileName : ""}
                top={state.leftMapView.top} left={state.leftMapView.left} width={state.mapWidth} height={state.mapHeight}
            />
            <MapViewer id={"right"}
                mapFile={state.appConfig.mapDir + "/" + state.selectedMap}
                top={state.rightMapView.top} left={state.rightMapView.left} width={state.mapWidth} height={state.mapHeight}
            />
        </div>
        <MapPoints topL={state.leftMapView.top} leftL={state.leftMapView.left} topR={state.rightMapView.top} leftR={state.rightMapView.left}></MapPoints>
        <MapSyncSwiitch syncMapMove={state.syncMapMove} ></MapSyncSwiitch>
        <MapData data={state.mapData.data}></MapData>
    </TopContext.Provider>
}
