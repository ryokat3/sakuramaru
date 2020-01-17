import { MapDataType } from "../../MapData"
import { Reducer } from "../../utils/ADLFlux"
import { defaultAppConfig } from "../AppConfig"
import { TopIDL } from "./TopIDL"

export type GripType = "left" | "right" | "none"

export const initialTopState = {
    appConfig: defaultAppConfig,
    mapInfo: Object.create(null) as MapDataType,
    mapBlob: Object.create(null) as { [fileName: string]: Blob },
    selectedMap: undefined as string | undefined,
    leftMap: undefined as string | undefined,
    grip: "none" as GripType,
    mapWidth: 200,
    mapHeight: 600,    
    rightMapView: {
        top: 0,
        left: 0
    },
    leftMapView: {
        top: 0,
        left: 0 
    },
    syncMapMove: false
}

export type TopStateType = typeof initialTopState

function moveRightMap(state:TopStateType, movementX:number, movementY:number):TopStateType {
    return {
        ...state,
        rightMapView: {
            ...state.rightMapView,
            top: Math.max(state.rightMapView.top - movementX, 0),
            left: Math.max(state.rightMapView.left - movementY, 0),
        }
    }
}

function moveLeftMap(state:TopStateType, movementX:number, movementY:number):TopStateType {
    return {
        ...state,
        leftMapView: {
            ...state.leftMapView,
            top: Math.max(state.leftMapView.top - movementX, 0),
            left: Math.max(state.leftMapView.left - movementY, 0)
        }
    }
}

export const topReducer = new Reducer<TopIDL, TopStateType>()
    .add("getMapInfo", (state, mapInfo) => {
        return {
            ...state,
            mapInfo
        }
    })
    .addError("getMapInfo", (state) => {
        return state
    })
    .add("getMap", (state, mapBlob) => {
        return {
            ...state,
            mapBlob: {
                ...state.mapBlob,
                [mapBlob.fileName]: mapBlob.blob
            }
        }
    })
    .add("selectMap", (state, mapFile) => {
        const leftMap = state.mapInfo[mapFile].leftMap?.fileName
        const point = state.mapInfo[mapFile].leftMap?.points[0] || [0, 0, 0, 0]

        return {
            ...state,
            selectedMap: mapFile,
            leftMap: leftMap,
            leftMapView: {
                top: point[0],
                left: point[1]
            },
            rightMapView: {
                top: point[2],
                left: point[3]
            }
        }
    })
    .add("gripMap", (state, id)=>{            
        return {
            ...state,
            grip: id as GripType
        }    
    })
    .add("ungripMap", (state)=>{                
        return {
            ...state,
            grip: "none" as GripType
        }    
    })
    .add("moveMap", (state, [movementX, movementY])=>{
        console.log(`right:[${state.rightMapView.top}, ${state.rightMapView.left}], left:[${state.leftMapView.top, state.leftMapView.left}], move:[${movementX}, ${movementY}]`)    
        if (state.grip === "none") {
            return state
        }
        else if (state.syncMapMove === true) {
            return moveLeftMap(moveRightMap(state, movementX, movementY), movementX, movementY)  
        }
        else if (state.grip === "left") {
            return moveLeftMap(state, movementX, movementY)
        }
        else if (state.grip === "right") {
            return moveRightMap(state, movementX, movementY)
        }
        else {
            return state         
        }
    })
    .add("switchSync", (state, syncMapMove)=>{
        return {
            ...state,
            syncMapMove: syncMapMove
        }
    })
    .build()
