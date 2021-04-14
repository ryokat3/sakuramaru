import { IpcMain, IpcMainEvent, IpcMainInvokeEvent, IpcRenderer, IpcRendererEvent } from "electron"
import { PromiseUnion, Unpromise, BoxType, ValueType } from "./tsUtils"

type BoxListenerType<T extends BoxType<unknown>, EventType> = T extends BoxType<null|undefined|void|never> ? ((event: EventType) => void)    
    : T extends BoxType<(...args: any[]) => PromiseUnion<null|undefined|void|never>> ? (event: EventType) => void
    : T extends BoxType<(...args: any[]) => PromiseUnion<unknown>> ?  (event: EventType, value: ValueType<Unpromise<ReturnType<T['type']>>>) => void
    : T extends BoxType<any> ? (event: EventType, arg: ValueType<T['type']>) => void
    : never

type ListenerType<T, EventType> = BoxListenerType<BoxType<T>, EventType>

type SendArgsType<T> = [ T ] extends [ null|undefined|void|never ] ? []
    : [ T ] extends [ ((...args: any[]) => any) ] ?  Parameters<T>
    : [ T ] extends [ any[] ] ? T
    : [ T ]    
     
type BoxInvokeReturnType<T extends BoxType<unknown>> = T extends BoxType<((...args: any[]) => PromiseUnion<unknown>)> ? ValueType<Unpromise<ReturnType<T['type']>>> : never
type InvokeReturnType<T> = BoxInvokeReturnType<BoxType<T>>

type HandlerType<T, EventType> = (event:EventType, ...args:SendArgsType<T>)=>InvokeReturnType<T>

export function getTypedIpcMain <T extends { [type: string]: any }>(ipcMain:IpcMain) {
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
        ) => ipcMain.handle(channel, listener as any), // TODO: remove 'as any'
        handleOnce: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: HandlerType<T[Channel], IpcMainInvokeEvent>
        ) => ipcMain.handleOnce(channel, listener as any), // TODO: remove 'as any'
        removeHandler: <Channel extends Extract<keyof T, string> > (
            channel: Channel
        ) => ipcMain.removeHandler(channel)
    }
}

export function getTypedIpcRenderer <T extends { [type: string]: any }>(ipcRenderer:IpcRenderer) {
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
