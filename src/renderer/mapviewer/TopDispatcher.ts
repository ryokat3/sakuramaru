import { pipe } from "fp-ts/lib/pipeable"
import * as TE from "fp-ts/lib/TaskEither"
import { right } from "fp-ts/lib/Either"
import { MapDataType } from "../../MapData"
import { Dispatcher, DispatcherType } from "../../utils/FdtFlux"
import { getRestTE, liftRestTE  } from "../../utils/RestTaskEither"
import { AppConfig } from "../AppConfig"
import { TopFdt } from "./TopFdt"

function getMapInfoPath(appConfig: AppConfig): string {
    return `${appConfig.mapDir}/${appConfig.mapData}`
}

function getMapFilePath(appConfig: AppConfig, mapFileName: string): string {
    return `${appConfig.mapDir}/${mapFileName}`
}

export const topDispatcher = new Dispatcher<TopFdt>()
    .addAsyncAction("getMapData", async (appConfig: AppConfig) => await pipe(
        getRestTE(getMapInfoPath(appConfig), { method: "GET", cache: "no-cache", credentials: "include" }),
        TE.chain(liftRestTE(async (response: Response) => await response.json() as MapDataType))
    )())
    .addAsyncAction("getMap", async (appConfig: AppConfig, fileName: string) => {
        return new Promise((resolve)=>{
            const image = new Image()            
            image.addEventListener('load', ()=>{
                resolve(right({ fileName:fileName, image:image}))
            }, false)
            image.src = getMapFilePath(appConfig, fileName)
        })
    })
    .addParameterAction("selectMap")
    .addParameterAction("gripMap")
    .addParameterAction("moveMap")
    .addAction("ungripMap")
    .addParameterAction("switchSync")
    .addParameterAction("changeMapSize")

export type TopDispatcherType = DispatcherType<typeof topDispatcher>

