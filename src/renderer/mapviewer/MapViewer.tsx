import React from "react"
import { TopContext } from "./Top"
import { GripType } from "./TopReducer"

export type MapViewerProps = {    
    mapFile?: string,
    top: number,
    left: number,
    width: number,
    height: number,
    id: GripType
}

export const MapViewer: React.FunctionComponent<MapViewerProps> = (props) => {

    const mapStyle = {
        backgroundImage: `url(${props.mapFile})`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        backgroundPosition: `-${props.top}px -${props.left}px`
    } 

    return <TopContext.Consumer>{(context)=>
        <div
            className={context.style.mapViewer}
            style={mapStyle}
            onMouseDown={(_)=>{context.dispatcher.gripMap(props.id)}}
            onMouseUp={(_)=>{context.dispatcher.ungripMap()}}
            onMouseLeave={(_)=>{context.dispatcher.ungripMap()}}
            onMouseMove={(e)=>{context.dispatcher.moveMap([e.movementX, e.movementY])}}
        ></div>    
    }</TopContext.Consumer>
}