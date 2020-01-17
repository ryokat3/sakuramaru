import { ipcMain, IpcMainEvent, IpcMainInvokeEvent, ipcRenderer, IpcRendererEvent } from "electron"
import { ADL, ValueType, Payload } from "./ADL"
import { PromiseUnion, Unpromise } from "./tsUtils"

type ListenerType<T extends ADL, EventType> = T extends Payload<null|undefined|void|never> ? ((event: EventType) => void)
    : T extends (...args: any[]) => Payload<null|undefined|void|never> ? (event: EventType) => void
    : T extends (...args: any[]) => PromiseUnion<Payload<unknown>> ?  (event: EventType, value: ValueType<Unpromise<ReturnType<T>>>) => void
    : T extends Payload<Array<any>> ? (event: EventType, ...args: ValueType<T>) => void
    : T extends Payload<any> ? (event: EventType, arg: ValueType<T>) => void
    : never

type SendArgsType<T extends ADL> = T extends Payload<null|undefined|void|never> ? []
    : T extends (...args: any[]) => Payload<any> ?  Parameters<T>
    : T extends any[] ? T
    : [ T ]

type HandlerType<T extends ADL, EventType> = T extends (...args: any[]) => any ?  (event: EventType, ...args: Parameters<T>) => PromiseUnion<ReturnType<T>> : never

type InvokeReturnType<T extends ADL> = T extends ((...args: any[]) => PromiseUnion<Payload<unknown>>) ? ValueType<Unpromise<ReturnType<T>>> : never

export function getTypedIpcMain <T extends { [type:string]:ADL }>() {
    return {
        // Listener functions
        on: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: ListenerType<T[Channel], IpcMainEvent>
            ) => ipcMain.on(channel, listener),
        once: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: ListenerType<T[Channel], IpcMainEvent>
        ) => ipcMain.once(channel, listener),
        removeListener: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: ListenerType<T[Channel], IpcMainEvent>
        ) => ipcMain.removeListener(channel, listener),
        removeAllListeners: <Channel extends Extract<keyof T, string> > (
            ...channels: Channel[]
        ) => ipcMain.removeAllListeners(...channels),

        // Handler functions
        handle: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: HandlerType<T[Channel], IpcMainInvokeEvent>
        ) => ipcMain.handle(channel, listener),
        handleOnce: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: HandlerType<T[Channel], IpcMainInvokeEvent>
        ) => ipcMain.handleOnce(channel, listener),
        removeHandler: <Channel extends Extract<keyof T, string> > (
            channel: Channel
        ) => ipcMain.removeHandler(channel)
    }
}

export function getTypedIpcRenderer <T extends { [type:string]:ADL }>() {
    return {
        // Listener functions
        on: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: ListenerType<T[Channel], IpcRendererEvent>
        ) => ipcRenderer.on(channel, listener),
        once: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: ListenerType<T[Channel], IpcRendererEvent>
        ) => ipcRenderer.once(channel, listener),
        removeListener: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: ListenerType<T[Channel], IpcRendererEvent>
        ) => ipcRenderer.removeListener(channel, listener),
        removeAllListeners: <Channel extends Extract<keyof T, string>>(
            channel: Channel
        ) => ipcRenderer.removeAllListeners(channel),

        // Sender functions
        send: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: SendArgsType<T[Channel]>
        ) => ipcRenderer.send(channel, ...args),
        invoke: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: SendArgsType<T[Channel]>
        ): Promise<InvokeReturnType<T[Channel]>> =>
            ipcRenderer.invoke(channel, ...args),
        sendSync: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: SendArgsType<T[Channel]>
        ): InvokeReturnType<T[Channel]> => ipcRenderer.sendSync(channel, ...args),
        sendTo: <Channel extends Extract<keyof T, string>>(
            webContentsId: number,
            channel: Channel,
            ...args: SendArgsType<T[Channel]>
        ) => ipcRenderer.sendTo(webContentsId, channel, ...args),
        sendToHost: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: SendArgsType<T[Channel]>
        ) => ipcRenderer.sendToHost(channel, ...args)
    }
}
