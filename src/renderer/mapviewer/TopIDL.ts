import { AppConfig } from "../../AppConfig"
import { MapInfoType } from "../../MapInfo"

export interface TopIDL {
    getAppConfig: () => Promise<AppConfig>,
    getMapInfo: () => Promise<MapInfoType>,
    selectMap: string
}
