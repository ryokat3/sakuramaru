import React, { useEffect, useState } from "react"
import { TopContext } from "./Top"
import { TopStateType } from "./TopReducer"

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
    doubleTapDistance: number,
    overlap: TopStateType["overlap"]
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
            const context = canvasRef.current.getContext("2d")
            if (props.leftMapImage !== undefined) {
                if (props.overlap === "left") {
                    context?.drawImage(props.leftMapImage, props.leftMapLeft, props.leftMapTop, props.width, props.height, 0, 0, props.width, props.height)
                }
                else {
                    context?.save()
                    context?.rotate(Math.PI/2)
                    context?.drawImage(props.leftMapImage, props.leftMapLeft, props.leftMapTop, props.width, props.height, 0, - props.height, props.width, props.height)
                    context?.restore()
                }
            }
            if (props.rightMapImage !== undefined) {
                if (props.overlap === "left") {
                    context?.drawImage(props.rightMapImage, props.rightMapLeft, props.rightMapTop, props.width, props.height, props.width, 0, props.width, props.height)
                }
                else {
                    context?.save()
                    context?.rotate(Math.PI/2)
                    context?.drawImage(props.rightMapImage, props.rightMapLeft, props.rightMapTop, props.width, props.height, 0, - props.height * 2, props.width, props.height)
                    context?.restore()
                }
            }
        }
    })

    const [touchX, setTouchX] = useState(0)
    const [touchY, setTouchY] = useState(0)
    const [tapTime, setTapTime] = useState(new Date().getTime())

    return <TopContext.Consumer>{(context) => <canvas
        ref={canvasRef}
        width={(props.overlap === "left") ? props.width * 2 : props.height * 2}
        height={(props.overlap === "left") ? props.height : props.width}
        onMouseDown={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            if ((e.clientX - rect.left) < ((props.overlap === "left") ? props.width : props.height)) {
                context.dispatcher.gripMap("left")
            }
            else {
                context.dispatcher.gripMap("right")
            }
        }}
        onMouseUp={(_) => {
            context.dispatcher.ungripMap()
        }}
        onMouseLeave={(_) => {
            context.dispatcher.ungripMap()
        }}
        onMouseMove={(e) => {
            if (props.overlap === "left") {
                context.dispatcher.moveMap([e.movementY, e.movementX])
            }
            else {
                context.dispatcher.moveMap([-e.movementX, e.movementY])
            }
        }}

        onTouchStart={(e) => {
            if (document.fullscreenEnabled) {
                const now = new Date().getTime()
                if ((now - tapTime) < props.doubleTapInterval) {
                    if (document.fullscreenElement === null && canvasRef.current !== null) {
                        canvasRef.current.requestFullscreen()
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
            if ((e.changedTouches[0].clientX - rect.left) < ((props.overlap === "left") ? props.width : props.height)) {
                context.dispatcher.gripMap("left")
            }
            else {
                context.dispatcher.gripMap("right")
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
            console.log(`onTouchMove, [${e.changedTouches[0].clientX}, ${e.changedTouches[0].clientY}]`)
            document.addEventListener("touchmove", preventDefault, { passive: false })
            document.body.style.touchAction = "none"
            document.body.style.overflow = "hidden"
            const moveX = e.changedTouches[0].clientX - touchX
            const moveY = e.changedTouches[0].clientY - touchY
            setTouchX(e.changedTouches[0].clientX)
            setTouchY(e.changedTouches[0].clientY)
            if (props.overlap === "left"){
                context.dispatcher.moveMap([moveY, moveX])
            }
            else {
                context.dispatcher.moveMap([- moveX, moveY])
            }

            // Cancel double tap
            if (moveX + moveY > props.doubleTapDistance) {
                setTapTime(0)
            }
        }}
    ></canvas>
    }</TopContext.Consumer>
}
