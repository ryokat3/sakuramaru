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

export function getRightMapData(state:TopStateType) {
    return (state.selectedMap !== undefined) ? state.mapData.maps[state.selectedMap] : undefined
}

export function getRightMapImage(state:TopStateType) {
    return (state.selectedMap !== undefined) ? state.mapImage[state.selectedMap] : undefined
}

export function getLeftMapImage(state:TopStateType) {    
    const leftMapFileName = getRightMapData(state)?.leftMap?.fileName
    return (leftMapFileName !== undefined) ? state.mapImage[leftMapFileName] : undefined
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
    .add("selectMap", (state, mapFile) => {        
        const point = state.mapData.maps[mapFile].leftMap?.points[0] || [0, 0, 0, 0]

        return {
            ...state,
            selectedMap: mapFile,            
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
        } else if ((state.syncMapMove === true) && (state.grip === "left")) {
            // return calibrateRightMap(moveLeftMap(state, movementX, movementY))
            return moveLeftMap(state, movementX, movementY)
        } else if ((state.syncMapMove === true) && (state.grip === "right")) {
            // return calibrateLeftMap(moveRightMap(state, movementX, movementY))
            return moveRightMap(state, movementX, movementY)
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
