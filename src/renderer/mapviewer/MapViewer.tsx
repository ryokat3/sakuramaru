import React, { useState } from "react"
import { TopContext } from "./Top"
import { GripType } from "./TopReducer"

export interface MapViewerProps {
    mapFile?: string,
    top: number,
    left: number,
    width: number,
    height: number,
    id: GripType
}

export const MapViewer: React.FunctionComponent<MapViewerProps> = (props) => {

    const [ touchX, setTouchX ] = useState(0)
    const [ touchY, setTouchY ] = useState(0)

    const mapStyle = {
        backgroundImage: `url(${props.mapFile})`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        backgroundPosition: `-${props.top}px -${props.left}px`
    }

    return <TopContext.Consumer>{(context) =>
        <div
            className={context.style.mapViewer}
            style={mapStyle}
            onMouseDown={(_) => {context.dispatcher.gripMap(props.id)}}
            onMouseUp={(_) => {context.dispatcher.ungripMap()}}
            onMouseLeave={(_) => {context.dispatcher.ungripMap()}}
            onMouseMove={(e) => {context.dispatcher.moveMap([e.movementX, e.movementY])}}

            onTouchStart={(e) => {
                setTouchX(e.changedTouches[0].clientX)
                setTouchY(e.changedTouches[0].clientY)
                context.dispatcher.gripMap(props.id)
            }}
            onTouchEnd={(_) => {context.dispatcher.ungripMap()}}
            onTouchCancel={(_) => {context.dispatcher.ungripMap()}}
            onTouchMove={(e) => {
                const moveX = e.changedTouches[0].clientX - touchX
                const moveY = e.changedTouches[0].clientY - touchY
                setTouchX(e.changedTouches[0].clientX)
                setTouchY(e.changedTouches[0].clientY)
                context.dispatcher.moveMap([moveX, moveY])
            }}
        ></div>
    }</TopContext.Consumer>
}
