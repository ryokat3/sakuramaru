import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { createContext, useEffect } from "react"
import { MapData } from "./MapData"
import { MapPoints } from "./MapPoints"
import { MapSelector } from "./MapSelector"
import { MapSyncSwiitch } from "./MapSyncSwitch"
import { MapCanvas } from "./MapCanvas"
import { topDispatcher, TopDispatcherType } from "./TopDispatcher"
import { initialTopState, topReducer, getRightMapImage, getLeftMapImage } from "./TopReducer"
import { AppConfig } from "../AppConfig"

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
    appConfig: AppConfig
}

export const TopContext = createContext<TopContextType>(Object.create(null))

export const Top: React.FunctionComponent<{}> = () => {
    const [state, dispatch] = React.useReducer(topReducer, initialTopState)
    const dispatcher = topDispatcher.build(dispatch)
    const style = useStyles()

    useEffect(() => {
        dispatcher.getMapData(state.appConfig)
    }, [])

    // const mapDivRef = React.useRef(null)

    const context = {
        dispatcher: dispatcher,
        style: style,
        appConfig: state.appConfig
    }

    document.onfullscreenchange = (_)=>{
        if (document.fullscreenEnabled) {
            if (document.fullscreenElement === null) {
                dispatcher.changeMapSize([600, 200])                
            }
            else {    
                dispatcher.changeMapSize([window.innerHeight, Math.floor(window.innerWidth / 2) ])
            }
        }
    }

    return <TopContext.Provider value={context}>
        <div><h1>{state.appConfig.name}</h1></div>
        <MapSelector mapData={state.mapData} mapImage={state.mapImage} mapFile={state.selectedMap}></MapSelector>
        <MapCanvas
            rightMapImage={getRightMapImage(state)}
            rightMapTop={state.rightView.top}
            rightMapLeft={state.rightView.left}
            leftMapImage={getLeftMapImage(state)}
            leftMapTop={state.leftView.top}
            leftMapLeft={state.leftView.left}
            width={state.viewWidth}
            height={state.viewHeight}
            doubleTapInterval={state.appConfig.doubleTapInterval}
            doubleTapDistance={state.appConfig.doubleTapDistance}      
        ></MapCanvas>        
        <MapPoints topL={state.leftView.top} leftL={state.leftView.left} topR={state.rightView.top} leftR={state.rightView.left}></MapPoints>
        <MapSyncSwiitch syncMapMove={state.syncMapMove} ></MapSyncSwiitch>
        <MapData data={state.mapData.data}></MapData>
    </TopContext.Provider>
}

/*
        <div ref={mapDivRef}>
            <MapViewer id={"left"}
                mapFile={(state.selectedMap !== undefined) ? state.appConfig.mapDir + "/" + state.mapData.maps[state.selectedMap].leftMap?.fileName : ""}
                top={state.leftMapView.top} left={state.leftMapView.left} width={state.mapWidth} height={state.mapHeight}
                mapDivRef={mapDivRef} doubleTapInterval={state.appConfig.doubleTapInterval} doubleTapDistance={state.appConfig.doubleTapDistance}
            />
            <MapViewer id={"right"}
                mapFile={state.appConfig.mapDir + "/" + state.selectedMap}
                top={state.rightMapView.top} left={state.rightMapView.left} width={state.mapWidth} height={state.mapHeight}
                mapDivRef={mapDivRef} doubleTapInterval={state.appConfig.doubleTapInterval} doubleTapDistance={state.appConfig.doubleTapDistance}
            />
        </div>
*/