import { BrowserWindowConstructorOptions } from "electron"

export const appConfig = {
    app: {
        name: "sakuramaru",
        configFileName: "sakuramaru.json",
        mapDir: "map",
        mapInfo: "mapinfo.json"
    },
    windowOptions: {
        width: 1200,
        height: 800,
        minWidth: 500,
        minHeight: 200,
        acceptFirstMouse: true,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true
        }
    } as BrowserWindowConstructorOptions
}

export type AppConfig = typeof appConfig
