import { AppConfig } from "../../appConfig"

export interface TopActionType {
    getAppConfig: () => Promise<AppConfig>,
    count: number
}
