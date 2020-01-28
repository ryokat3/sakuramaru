import React, { useState } from "react"
import { TopContext } from "./Top"
import { GripType } from "./TopReducer"

export interface MapViewerProps {
    mapFile?: string,
    top: number,
    left: number,
    width: number,
    height: number,
    id: GripType,
    mapDivRef: React.MutableRefObject<any>,
    doubleTapInterval: number,
    doubleTapDistance: number
}
const preventDefault = (e: TouchEvent) => {
    if (e.cancelable) {
        e.preventDefault()
    }
}

export const MapViewer: React.FunctionComponent<MapViewerProps> = (props) => {

    const [ touchX, setTouchX ] = useState(0)
    const [ touchY, setTouchY ] = useState(0)
    const [ tapTime, setTapTime ] = useState(new Date().getTime())

    const mapStyle = {
        backgroundImage: `url(${props.mapFile})`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        backgroundPosition: `-${props.top}px -${props.left}px`,
        overscrollBehavior: "none",
        overflow: "auto"
    }

    return <TopContext.Consumer>{(context) =>
        <div
            className={context.style.mapViewer}
            style={mapStyle}
            onMouseDown={(_) => {
                console.log(`mouse down`)    
                context.dispatcher.gripMap(props.id)
            }}
            onMouseUp={(_) => {
                console.log(`mouse up`)        
                context.dispatcher.ungripMap()
            }}
            onMouseLeave={(_) => {
                console.log(`mouse leave`)        
                context.dispatcher.ungripMap()
            }}
            onMouseMove={(e) => {
                console.log(`mouse move`)        
                context.dispatcher.moveMap([e.movementX, e.movementY])
            }}

            onTouchStart={(e) => {  
                console.log(`touch start: ${e.touches.length}`)
                
                if (document.fullscreenEnabled) {
                    const now = new Date().getTime()
                    if ((now - tapTime) < props.doubleTapInterval) {
                        if (document.fullscreenElement === null) {
                            props.mapDivRef.current.requestFullscreen()
                        }
                        else {
                            document.exitFullscreen()    
                        }
                    }
                    setTapTime(now)                 
                }   
                
                document.addEventListener("touchmove", preventDefault, { passive: false})
                document.body.style.touchAction = "none"
                document.body.style.overflow = "hidden"
                setTouchX(e.changedTouches[0].clientX)
                setTouchY(e.changedTouches[0].clientY)
                context.dispatcher.gripMap(props.id)
            }}
            onTouchEnd={(e) => {
                console.log(`touch end: ${e.touches.length}`)                                     
                if (e.touches.length > 0) {
                    return    
                }
                context.dispatcher.ungripMap()
                document.body.style.touchAction = "auto"
                document.removeEventListener("touchmove", preventDefault)                
            }}
            onTouchCancel={(e) => {
                console.log(`touch cancel: ${e.touches.length}`)         
                if (e.touches.length > 0) {
                    return    
                }
                context.dispatcher.ungripMap()
                document.body.style.touchAction = "auto"
                document.removeEventListener("touchmove", preventDefault)                
            }}
            onTouchMove={(e) => {                
                console.log(`touch move: ${e.touches.length}`)             
                document.addEventListener("touchmove", preventDefault, { passive: false})    
                document.body.style.touchAction = "none"
                document.body.style.overflow = "hidden"
                const moveX = e.changedTouches[0].clientX - touchX
                const moveY = e.changedTouches[0].clientY - touchY
                setTouchX(e.changedTouches[0].clientX)
                setTouchY(e.changedTouches[0].clientY)
                context.dispatcher.moveMap([moveX, moveY])
                
                // Cancel double tap                
                if (moveX + moveY > props.doubleTapDistance) {
                    setTapTime(0)
                }
            }}
        ></div>
    }</TopContext.Consumer>
}
