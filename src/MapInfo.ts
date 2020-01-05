import * as fs from "fs"
import * as path from "path"
import { AppConfig } from "./AppConfig"
import { RuntimeInfo } from "./RuntimeInfo"

export interface MapInfoType {
    [fileName: string]: {
        description?: string
        eastMap: string|null
    }
}

function getMapInfoPath(runtimeInfo: RuntimeInfo, appConfig: AppConfig): string {
    return path.join(runtimeInfo.dir, appConfig.app.mapDir, appConfig.app.mapInfo)
}
export function readMapInfo(runtimeInfo: RuntimeInfo, appConfig: AppConfig): MapInfoType {
    return JSON.parse(fs.readFileSync(getMapInfoPath(runtimeInfo, appConfig)).toString())
}
