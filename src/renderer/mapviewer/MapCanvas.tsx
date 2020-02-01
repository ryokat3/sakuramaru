import React, { useEffect, useState } from "react"
import { TopContext } from "./Top"

type MapCanvasProps = {
    rightMapImage?: HTMLImageElement,
    rightMapTop: number,
    rightMapLeft: number,
    leftMapImage?: HTMLImageElement,
    leftMapTop: number,
    leftMapLeft: number,
    width: number,
    height: number,
    doubleTapInterval: number,
    doubleTapDistance: number
}

const preventDefault = (e: TouchEvent) => {
    if (e.cancelable) {
        e.preventDefault()
    }
}

export const MapCanvas: React.FunctionComponent<MapCanvasProps> = (props) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if ((canvasRef.current !== undefined) && (canvasRef.current !== null)) {
            const context = canvasRef.current.getContext('2d')
            if (props.leftMapImage !== undefined) {
                context?.drawImage(props.leftMapImage, props.leftMapLeft, props.leftMapTop, props.width, props.height, 0, 0, props.width, props.height)
            }
            if (props.rightMapImage !== undefined) {
                context?.drawImage(props.rightMapImage, props.rightMapLeft, props.rightMapTop, props.width, props.height, props.width, 0, props.width, props.height)
            }
        }
    })

    const [touchX, setTouchX] = useState(0)
    const [touchY, setTouchY] = useState(0)
    const [tapTime, setTapTime] = useState(new Date().getTime())

    return <TopContext.Consumer>{(context) => <canvas
        ref={canvasRef}
        width={props.width * 2}
        height={props.height}
        onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()    
            if ((e.clientX - rect.left) < props.width) {
                context.dispatcher.gripMap('left')
            }
            else {
                context.dispatcher.gripMap('right')
            }
        }}
        onMouseUp={(_) => {            
            context.dispatcher.ungripMap()
        }}
        onMouseLeave={(_) => {            
            context.dispatcher.ungripMap()
        }}
        onMouseMove={(e) => {            
            context.dispatcher.moveMap([e.movementY, e.movementX])
        }}

        onTouchStart={(e) => {            
            if (document.fullscreenEnabled) {
                const now = new Date().getTime()
                if ((now - tapTime) < props.doubleTapInterval) {
                    if (document.fullscreenElement === null && canvasRef.current !== null) {
                        canvasRef.current.requestFullscreen().then(()=>{
                            const rect = canvasRef.current?.getBoundingClientRect()    
                        })
                    }
                    else {
                        document.exitFullscreen()
                    }
                }
                setTapTime(now)
            }

            document.addEventListener("touchmove", preventDefault, { passive: false })
            document.body.style.touchAction = "none"
            document.body.style.overflow = "hidden"
            setTouchX(e.changedTouches[0].clientX)
            setTouchY(e.changedTouches[0].clientY)

            const rect = e.currentTarget.getBoundingClientRect()    
            if ((e.changedTouches[0].clientX - rect.left) < props.width) {
                context.dispatcher.gripMap('left')
            }
            else {
                context.dispatcher.gripMap('right')
            }            
        }}
        onTouchEnd={(e) => {            
            if (e.touches.length > 0) {
                return
            }
            context.dispatcher.ungripMap()
            document.body.style.touchAction = "auto"
            document.removeEventListener("touchmove", preventDefault)
        }}
        onTouchCancel={(e) => {            
            if (e.touches.length > 0) {
                return
            }
            context.dispatcher.ungripMap()
            document.body.style.touchAction = "auto"
            document.removeEventListener("touchmove", preventDefault)
        }}
        onTouchMove={(e) => {            
            document.addEventListener("touchmove", preventDefault, { passive: false })
            document.body.style.touchAction = "none"
            document.body.style.overflow = "hidden"
            const moveX = e.changedTouches[0].clientX - touchX
            const moveY = e.changedTouches[0].clientY - touchY
            setTouchX(e.changedTouches[0].clientX)
            setTouchY(e.changedTouches[0].clientY)
            context.dispatcher.moveMap([moveY, moveX])

            // Cancel double tap                
            if (moveX + moveY > props.doubleTapDistance) {
                setTapTime(0)
            }
        }}
    ></canvas>
    }</TopContext.Consumer>
}    
