import { ipcMain, IpcMainEvent, IpcMainInvokeEvent, ipcRenderer, IpcRendererEvent } from "electron"
import { ActionSetType } from "./TypedFlux"
import { PromiseUnion, Unpromise } from "./tsUtils"

type ListenerType<T, EventType> = T extends null | undefined | void ? (event:EventType) => void
    : T extends (...args:any[])=>null | undefined | void ?  (event:EventType) => void    
    : T extends (...args:any[])=>any ?  (event:EventType, value:Unpromise<ReturnType<T>>) => void
    : T extends any[] ? (event:EventType, ...args:T)=>void
    : (event:EventType, value:T)=>void

type HandlerType<T, EventType> = T extends null | undefined | void ? (event:EventType) => void
    : T extends (...args:any[])=>any ?  (event:EventType, ...args:Parameters<T>) => PromiseUnion<ReturnType<T>>    
    : (event:EventType)=>PromiseUnion<T>

type SendArgsType<T> = T extends null | undefined | void ? []
    : T extends (...args:any[])=>any ?  Parameters<T>
    : T extends any[] ? T
    : [ T ]

type InvokeReturnType<T> = T extends (...args:any[])=>any ? Unpromise<ReturnType<T>> : void


export function getTypedIpcMain <T extends ActionSetType>() {
    return {
        // Listener functions
        on: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: ListenerType<T[Channel], IpcMainEvent>,
            ) => ipcMain.on(channel, listener),
        once: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: ListenerType<T[Channel], IpcMainEvent>,
        ) => ipcMain.once(channel, listener),
        removeListener: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: ListenerType<T[Channel], IpcMainEvent>,
        ) => ipcMain.removeListener(channel, listener),
        removeAllListeners: <Channel extends Extract<keyof T, string> > (
            ...channels: Channel[]
        ) => ipcMain.removeAllListeners(...channels),

        // Handler functions
        handle: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: HandlerType<T[Channel], IpcMainInvokeEvent>,
        ) => ipcMain.handle(channel, listener),
        handleOnce: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: HandlerType<T[Channel], IpcMainInvokeEvent>,
        ) => ipcMain.handleOnce(channel, listener),
        removeHandler: <Channel extends Extract<keyof T, string> > (
            channel: Channel
        ) => ipcMain.removeHandler(channel)
    }
}

export function getTypedIpcRenderer <T extends ActionSetType>() {
    return {
        // Listener functions
        on: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: ListenerType<T[Channel], IpcRendererEvent>,
        ) => ipcRenderer.on(channel, listener),
        once: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: ListenerType<T[Channel], IpcRendererEvent>,
        ) => ipcRenderer.once(channel, listener),
        removeListener: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: ListenerType<T[Channel], IpcRendererEvent>,            
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
