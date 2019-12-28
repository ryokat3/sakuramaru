import { mergeobj } from "boost-ts"
import { Command } from "commander"
import { App, app, BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import * as fs from "fs"
import * as path from "path"
import { appConfig } from "./appConfig"
import { TopActionType } from "./renderer/top/topAction"
import { getTypedIpcMain } from "./utils/TypedIPC"

type AppConfig = typeof appConfig

function getCommandLineParse(appConfig: AppConfig) {
    return new Command(appConfig.app.name).option("--config <config>", "Config file", appConfig.app.configFileName)
}

function initAppConfig(appConfig: AppConfig, processCwd: string, processArgv: string[]): AppConfig {

    const commandOptions = getCommandLineParse(appConfig).parse(processArgv)
    const configFilePath = path.join(processCwd,
        (commandOptions.config) ? commandOptions.config : appConfig.app.configFileName)
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

function initIpc(config: AppConfig) {
    const ipc = getTypedIpcMain<TopActionType>()

    ipc.handle("getAppConfig", () => config)
}

function createWindow(url: string, windowOptions: BrowserWindowConstructorOptions) {
    const win = new BrowserWindow(windowOptions)

    win.loadURL(url)
    win.on("closed", () => { })

    return win
}

async function init() {
    const config = initAppConfig(appConfig, process.cwd(), process.argv)
    await initApp(app)
    initIpc(config)

    const win = createWindow(`file://${__dirname}/index.html`, config.windowOptions)

    return {
        config,
        app,
        win
    }
}

init()
