import { Dispatcher, DispatcherType } from "../../utils/IDLFlux"
import { rest } from "../../utils/IDLRest"
import { TopIDL } from "./TopIDL"

export const topDispatcher = new Dispatcher<TopIDL>()    
    .addAsyncAction("getMapInfo", async (mapInfoPath:string) => await rest(mapInfoPath, { method: "GET", cache: "no-cache", credentials: "include" }))
    .addParameterAction("selectMap")

export type TopDispatcherType = DispatcherType<typeof topDispatcher>
