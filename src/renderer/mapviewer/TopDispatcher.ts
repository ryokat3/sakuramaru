import { pipe } from "fp-ts/lib/pipeable"
import * as TE from "fp-ts/lib/TaskEither"
import { Dispatcher, DispatcherType } from "../../utils/IDLFlux"
import { restTaskEither } from "../../utils/restTaskEither"
import { TopIDL } from "./TopIDL"
import { AppConfig } from "../AppConfig"
import { MapDataType } from "../../MapData"
import { right } from "fp-ts/lib/Either"

function getMapInfoPath(appConfig:AppConfig):string {
    return `${appConfig.mapDir}/${appConfig.mapData}`    
}

export const topDispatcher = new Dispatcher<TopIDL>()    
    .addAsyncAction("getMapInfo", async (appConfig:AppConfig) => {
        return (await pipe(
            restTaskEither(getMapInfoPath(appConfig), { method: "GET", cache: "no-cache", credentials: "include" }),                        
            TE.chain((restSuccess)=> async () => {                
                return right({
                    ...restSuccess,    
                    payload: await restSuccess.payload.json() as MapDataType
                })
            })
        ))()
    
    })
    .addParameterAction("selectMap")

export type TopDispatcherType = DispatcherType<typeof topDispatcher>
