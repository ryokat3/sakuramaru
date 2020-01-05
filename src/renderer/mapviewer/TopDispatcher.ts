import { Dispatcher, DispatcherType } from "../../utils/IDLFlux"
import { getTypedIpcRenderer } from "../../utils/IDLIPC"
import { TopIDL } from "./TopIDL"

const ipc = getTypedIpcRenderer<TopIDL>()

export const topDispatcher = new Dispatcher<TopIDL>()
    .addAsyncAction("getAppConfig", async () => ipc.invoke("getAppConfig"))
    .addAsyncAction("getMapInfo", async () => ipc.invoke("getMapInfo"))
    .addParameterAction("selectMap")

export type TopDispatcherType = DispatcherType<typeof topDispatcher>
