import { Dispatcher } from "../../utils/TypedFlux"
import { getTypedIpcRenderer } from "../../utils/TypedIPC"
import { TopActionType } from "./topAction"

const ipc = getTypedIpcRenderer<TopActionType>()

export const topDispatcher = new Dispatcher<TopActionType>()
    .addAsyncAction("getAppConfig", async () => ipc.invoke("getAppConfig"))
