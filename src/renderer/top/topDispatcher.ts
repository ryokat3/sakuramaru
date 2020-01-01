import { Dispatcher } from "../../utils/IDLFlux"
import { getTypedIpcRenderer } from "../../utils/IDLIPC"
import { TopActionType } from "./topAction"

const ipc = getTypedIpcRenderer<TopActionType>()

export const topDispatcher = new Dispatcher<TopActionType>()
    .addAsyncAction("getAppConfig", async () => ipc.invoke("getAppConfig"))
