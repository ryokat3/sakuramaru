import { MapDataType } from "../../MapData"
import { Reducer } from "../../utils/FdtFlux"
import { defaultAppConfig } from "../AppConfig"
import { calibrateLeftMap, calibrateRightMap, getSyncPoints, moveLeftMap, moveRightMap } from "./MapCalibrator"
import { TopFdt } from "./TopFdt"

export type GripType = "left" | "right" | "none"

export const initialTopState = {
    appConfig: defaultAppConfig,
    mapData: {
        maps: Object.create(null),
        data: Object.create(null)
    } as MapDataType,
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
    syncMapMove: true
}

export type TopStateType = typeof initialTopState

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
        const leftMap = state.mapData.maps[mapFile].leftMap?.fileName
        const point = state.mapData.maps[mapFile].leftMap?.points[0] || [0, 0, 0, 0]

        return {
            ...state,
            selectedMap: mapFile,
            leftMap,
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
            return calibrateRightMap(moveLeftMap(state, movementX, movementY))
        } else if ((state.syncMapMove === true) && (state.grip === "right")) {
            return calibrateLeftMap(moveRightMap(state, movementX, movementY))
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
            mapHeight: height,
            mapWidth: width
        }    
    })
    .add("switchSync", (state, syncMapMove) => {
        return {
            ...state,
            syncMapMove
        }
    })
    .build()
