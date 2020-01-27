import { mergeobj } from "boost-ts"
import { Command } from "commander"
import { App, app, BrowserWindow, BrowserWindowConstructorOptions } from "electron"
import * as fs from "fs"
import * as path from "path"
import { defaultMainConfig, MainConfig } from "./MainConfig"
import { getRuntimeInfo, RuntimeInfo } from "./RuntimeInfo"

function getCommandLineParse(appConfig: MainConfig) {
    return new Command(appConfig.app.name).option("--config <config>", "Config file", appConfig.app.configFileName)
}

function initMainConfig(runtimeInfo: RuntimeInfo, appConfig: MainConfig): MainConfig {
    const commandOptions = getCommandLineParse(appConfig).parse(runtimeInfo.argv)
    const configFilePath = path.join(runtimeInfo.dir, (commandOptions.config) ? commandOptions.config : appConfig.app.configFileName)
    return mergeobj(appConfig, fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath, "utf-8")) : {})
}

async function initMain(app: App): Promise<void> {
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

function createWindow(url: string, windowOptions: BrowserWindowConstructorOptions) {
    const win = new BrowserWindow(windowOptions)

    win.loadURL(url)
    win.on("closed", () => { })

    return win
}

async function init(runtimeInfo: RuntimeInfo) {
    const appConfig = initMainConfig(runtimeInfo, defaultMainConfig)
    await initMain(app)

    const win = createWindow(`file://${__dirname}/index.html`, appConfig.windowOptions)

    return {
        config: appConfig,
        runtimeInfo,
        app,
        win
    }
}

init(getRuntimeInfo())
