import { AppConfig } from "../../AppConfig"
import { MapDataType } from "../../MapData"

export interface TopIDL {
    getAppConfig: () => Promise<AppConfig>,
    getMapInfo: () => Promise<MapDataType>,
    getMap:(fileName:string) => Promise<Blob>

    selectMap: string
}
