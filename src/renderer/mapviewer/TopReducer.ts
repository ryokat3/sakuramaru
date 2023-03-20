import { MapDataType } from "../../MapData"
import { Reducer } from "../../utils/FdtFlux"
import { defaultAppConfig } from "../AppConfig"
import { getSyncPoints, moveLeftMap, moveRightMap } from "./MapCalibrator"
import { TopFdt } from "./TopFdt"

export type GripType = "left" | "right" | "none"

export const initialTopState = {
    appConfig: defaultAppConfig,
    mapData: {
        maps: Object.create(null),
        data: Object.create(null)
    } as MapDataType,
    mapImage: Object.create(null) as { [fileName: string]: HTMLImageElement },
    selectedMap: undefined as string | undefined,
    overlap: "left" as "left" | "upper",
    grip: "none" as GripType,
    viewWidth: 200,
    viewHeight: 600,
    rightView: {
        left: 0,
        top: 0
    },
    leftView: {
        left: 0,
        top: 0
    },
    syncMapMove: true
}



export type TopStateType = typeof initialTopState

function getRightMapData(mapData:MapDataType, mapFileName:string|undefined) {
    return (mapFileName !== undefined) ? mapData.maps[mapFileName] : undefined
}

export function getRightMapImage(mapImage:TopStateType["mapImage"], mapFileName:string|undefined) {
    return (mapFileName !== undefined) ? mapImage[mapFileName] : undefined
}


export function getLeftViewFile(mapData:MapDataType, mapFileName:string|undefined, overlap:TopStateType["overlap"] = "left") {
    return (overlap === "left") ? getRightMapData(mapData, mapFileName)?.leftMap?.fileName : getRightMapData(mapData, mapFileName)?.upperMap?.fileName
}

export function getLeftMapImage(mapData:MapDataType, mapImage:TopStateType["mapImage"], mapFileName:string|undefined, overlap:TopStateType["overlap"] = "left") {
    const leftViewFileName = getLeftViewFile(mapData, mapFileName, overlap)
    return (leftViewFileName !== undefined) ? mapImage[leftViewFileName] : undefined
}


export const topReducer = new Reducer<TopFdt, TopStateType>()
    .add("getMapData", (state, mapData) => {
        return {
            ...state,
            mapData
        }
    })
    .addError("getMapData", (state) => {
        return state
    })
    .add("getMap", (state, mapImage) => {
        return {
            ...state,
            mapImage: {
                ...state.mapImage,
                [mapImage.fileName]: mapImage.image
            }
        }
    })
    .add("selectMap", (state, mapData) => {
        const rightMapData = getRightMapData(state.mapData, mapData.fileName)
        const point = (mapData.overlap === "left") ? (rightMapData?.leftMap?.points !== undefined ? rightMapData?.leftMap?.points.length > 0 ? rightMapData?.leftMap?.points[0] : [0,0,0,0] :[0,0,0,0])
            : (rightMapData?.upperMap?.points !== undefined ? rightMapData?.upperMap?.points.length > 0 ? rightMapData?.upperMap?.points[0] : [0,0,0,0] :[0,0,0,0])
        const overlapChanged = (state.overlap !== mapData.overlap)

        return {
            ...state,
            selectedMap: mapData.fileName,
            overlap: mapData.overlap,
            viewWidth: (overlapChanged) ? state.viewHeight : state.viewWidth,
            viewHeight: (overlapChanged) ? state.viewWidth : state.viewHeight,
            leftView: {
                left: point[0],
                top: point[1]
            },
            rightView: {
                left: point[2],
                top: point[3]
            }
        }
    })
    .add("gripMap", (state, id) => {
        return {
            ...state,
            grip: id as GripType
        }
    })
    .add("ungripMap", (state) => {
        return {
            ...state,
            grip: "none" as GripType
        }
    })
    .add("moveMap", (state, [movementX, movementY]) => {
        const points = getSyncPoints(state)

        if (state.grip === "none") {
            return state
        } else if ((state.syncMapMove === true) && (points.length == 0)) {
            return moveLeftMap(moveRightMap(state, movementX, movementY), movementX, movementY)
/*
        } else if ((state.syncMapMove === true) && (state.grip === "left")) {
            return moveLeftMap(state, movementX, movementY)
        } else if ((state.syncMapMove === true) && (state.grip === "right")) {
            return moveRightMap(state, movementX, movementY)
*/
        } else if (state.grip === "left") {
            return moveLeftMap(state, movementX, movementY)
        } else if (state.grip === "right") {
            return moveRightMap(state, movementX, movementY)
        } else {
            return state
        }
    })
    .add("changeMapSize", (state, [height, width])=>{
        return {
            ...state,
            viewHeight: height,
            viewWidth: width
        }
    })
    .add("switchSync", (state, syncMapMove) => {
        return {
            ...state,
            syncMapMove
        }
    })
    .build()
