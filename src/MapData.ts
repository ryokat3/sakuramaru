import * as fs from "fs"
import * as path from "path"
import { MainConfig } from "./MainConfig"
import { RuntimeInfo } from "./RuntimeInfo"

export interface MapDataType {
    [fileName: string]: {
        description?: string
        leftMap?: {
            fileName: string,
            points: Array<[number, number, number, number]> // [leftX, leftY, rightX, rightY]
        }
    }
}

function getMapDataPath(runtimeInfo: RuntimeInfo, appConfig: MainConfig): string {
    return path.join(runtimeInfo.dir, appConfig.app.mapDir, appConfig.app.mapData)
}
export function readMapData(runtimeInfo: RuntimeInfo, appConfig: MainConfig): MapDataType {
    return JSON.parse(fs.readFileSync(getMapDataPath(runtimeInfo, appConfig)).toString())
}
