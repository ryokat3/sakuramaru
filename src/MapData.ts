import * as fs from "fs"
import * as path from "path"
import { AppConfig } from "./AppConfig"
import { RuntimeInfo } from "./RuntimeInfo"

interface Point {
    x: number
    y: number
}

export interface MapDataType {
    [fileName: string]: {
        description?: string
        rightMap?: string
        points: Array<{ inThis: Point, inRight: Point }>
    }
}

function getMapDataPath(runtimeInfo: RuntimeInfo, appConfig: AppConfig): string {
    return path.join(runtimeInfo.dir, appConfig.app.mapDir, appConfig.app.mapData)
}
export function readMapData(runtimeInfo: RuntimeInfo, appConfig: AppConfig): MapDataType {
    return JSON.parse(fs.readFileSync(getMapDataPath(runtimeInfo, appConfig)).toString())
}
