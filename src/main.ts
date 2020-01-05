import { mergeobj } from "boost-ts"
import { Command } from "commander"
import { App, app, BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import * as fs from "fs"
import * as path from "path"
import { AppConfig, defaultAppConfig } from "./AppConfig"
import { readMapInfo } from "./MapInfo"
import { TopIDL } from "./renderer/mapviewer/TopIDL"
import { getRuntimeInfo, RuntimeInfo } from "./RuntimeInfo"
import { getTypedIpcMain } from "./utils/IDLIPC"

function getCommandLineParse(appConfig: AppConfig) {
    return new Command(appConfig.app.name).option("--config <config>", "Config file", appConfig.app.configFileName)
}

function initAppConfig(runtimeInfo: RuntimeInfo, appConfig: AppConfig): AppConfig {
    const commandOptions = getCommandLineParse(appConfig).parse(runtimeInfo.argv)
    const configFilePath = path.join(runtimeInfo.dir, (commandOptions.config) ? commandOptions.config : appConfig.app.configFileName)
    return mergeobj(appConfig, fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath, "utf-8")) : {})
}

async function initApp(app: App): Promise<void> {
    return new Promise((resolve) => {
        app.on("window-all-closed", () => {
            app.quit()
        })

        app.on("ready", () => {
            resolve()
        })

        app.on("activate", () => {

        })
    })
}

function initIpc(runtimeInfo: RuntimeInfo, appConfig: AppConfig) {
    const ipc = getTypedIpcMain<TopIDL>()

    ipc.handle("getAppConfig", () => appConfig)
    ipc.handle("getMapInfo", () => readMapInfo(runtimeInfo, appConfig))
}

function createWindow(url: string, windowOptions: BrowserWindowConstructorOptions) {
    const win = new BrowserWindow(windowOptions)

    win.loadURL(url)
    win.on("closed", () => { })

    return win
}

async function init(runtimeInfo: RuntimeInfo) {
    const appConfig = initAppConfig(runtimeInfo, defaultAppConfig)
    await initApp(app)
    initIpc(runtimeInfo, appConfig)

    const win = createWindow(`file://${__dirname}/index.html`, appConfig.windowOptions)

    return {
        config: appConfig,
        runtimeInfo,
        app,
        win
    }
}

init(getRuntimeInfo())
