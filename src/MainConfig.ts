import { defaultAppConfig } from "./renderer/AppConfig"

export const defaultMainConfig = {
    app: defaultAppConfig
}

export type MainConfig = typeof defaultMainConfig
