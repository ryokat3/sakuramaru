// import { Theme } from "@emotion/react"
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

export interface TopContextType {
    dispatcher: TopDispatcherType
    appConfig: AppConfig
}

export const TopContext = createContext<TopContextType>(Object.create(null))

export const Top: React.FunctionComponent<{}> = () => {
    const [state, dispatch] = React.useReducer(topReducer, initialTopState)
    const dispatcher = topDispatcher.build(dispatch)

    useEffect(() => {
        dispatcher.getMapData(state.appConfig)
    }, [])

    const context = {
        dispatcher,
        appConfig: state.appConfig
    }

    document.onfullscreenchange = (_)=>{
        if (document.fullscreenEnabled) {
            if (document.fullscreenElement === null) {
                dispatcher.changeMapSize((state.overlap === "left") ? [600, 200] : [200, 600])
            }
            else {
                dispatcher.changeMapSize((state.overlap === "left") ? [window.innerHeight, Math.floor(window.innerWidth / 2) ]: [Math.floor(window.innerWidth / 2), window.innerHeight ])
            }
        }
    }

    return <TopContext.Provider value={context}>
        <div><h1>{state.appConfig.name}</h1></div>
        <MapSelector mapData={state.mapData} mapImage={state.mapImage} mapFile={state.selectedMap} overlap={state.overlap}></MapSelector>
        <MapCanvas
            rightMapImage={getRightMapImage(state.mapImage, state.selectedMap)}
            rightMapTop={state.rightView.top}
            rightMapLeft={state.rightView.left}
            leftMapImage={getLeftMapImage(state.mapData, state.mapImage, state.selectedMap, state.overlap)}
            leftMapTop={state.leftView.top}
            leftMapLeft={state.leftView.left}
            width={state.viewWidth}
            height={state.viewHeight}
            doubleTapInterval={state.appConfig.doubleTapInterval}
            doubleTapDistance={state.appConfig.doubleTapDistance}
            overlap={state.overlap}
        ></MapCanvas>
        <MapPoints topL={state.leftView.top} leftL={state.leftView.left} topR={state.rightView.top} leftR={state.rightView.left}></MapPoints>
        <MapSyncSwiitch syncMapMove={state.syncMapMove} ></MapSyncSwiitch>
        <MapData data={state.mapData.data}></MapData>
    </TopContext.Provider>
}