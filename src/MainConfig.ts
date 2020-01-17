import { BrowserWindowConstructorOptions } from "electron"
import { defaultAppConfig } from "./renderer/AppConfig"

export const defaultMainConfig = {
    app: defaultAppConfig,
    windowOptions: {
        width: 1200,
        height: 800,
        minWidth: 500,
        minHeight: 200,
        acceptFirstMouse: true,
        titleBarStyle: "hidden",
        flame: false,
        webPreferences: {
            nodeIntegration: true
        }
    } as BrowserWindowConstructorOptions
}

export type MainConfig = typeof defaultMainConfig
