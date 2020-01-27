import { pipe } from "fp-ts/lib/pipeable"
import * as TE from "fp-ts/lib/TaskEither"
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
    .addAsyncAction("getMap", async (appConfig: AppConfig, fileName: string) => await pipe(
        getRestTE(getMapFilePath(appConfig, fileName), { method: "GET", cache: "no-cache", credentials: "include" }),
        TE.chain(liftRestTE(async (response: Response) => {
            return {
                fileName,
                blob: await response.blob()
            }
        }))
    )())
    .addParameterAction("selectMap")
    .addParameterAction("gripMap")
    .addParameterAction("moveMap")
    .addAction("ungripMap")
    .addParameterAction("switchSync")

export type TopDispatcherType = DispatcherType<typeof topDispatcher>
