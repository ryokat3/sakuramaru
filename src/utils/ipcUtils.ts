import { ipcMain, IpcMainEvent, IpcMainInvokeEvent, ipcRenderer, IpcRendererEvent } from "electron"
import { FSA } from "flux-standard-action"
import { Dispatch } from "react"
import { ActionSetType } from "./fluxUtils"
import { PromiseIfNot, PromiseUnion } from "./tsUtils"
import { createAsyncDispatcher } from "./fluxUtils"

export function getTypedIpcMain <T extends ActionSetType>() {
    return {
        // Listener functions
        on: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: (event: IpcMainEvent, ...args: Parameters<T[Channel]>) => unknown
            ) => ipcMain.on(channel, listener as (event: IpcMainEvent, ...args: any[]) => void ),
        once: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: (event: IpcMainEvent, ...args: Parameters<T[Channel]>) => unknown
        ) => ipcMain.once(channel, listener as (event: IpcMainEvent, ...args: any[]) => void ),
        removeListener: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: (event: IpcMainEvent, ...args: Parameters<T[Channel]>) => unknown
        ) => ipcMain.removeListener(channel, listener as (event: IpcMainEvent, ...args: any[]) => void ),
        removeAllListeners: <Channel extends Extract<keyof T, string> > (
            ...channels: Channel[]
        ) => ipcMain.removeAllListeners(...channels),

        // Handler functions
        handle: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: (event: IpcMainInvokeEvent, ...args: Parameters<T[Channel]>) => PromiseUnion<ReturnType<T[Channel]>>
        ) => ipcMain.handle(channel, listener as (event: IpcMainInvokeEvent, ...args: any[]) => PromiseUnion<ReturnType<T[Channel]>>),
        handleOnce: <Channel extends Extract<keyof T, string> > (
            channel: Channel,
            listener: (event: IpcMainInvokeEvent, ...args: Parameters<T[Channel]>) => PromiseUnion<ReturnType<T[Channel]>>
        ) => ipcMain.handleOnce(channel, listener as (event: IpcMainInvokeEvent, ...args: any[]) => PromiseUnion<ReturnType<T[Channel]>>),
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
            listener: (event: IpcRendererEvent, ...args: Parameters<T[Channel]>) => unknown
        ) => ipcRenderer.on(channel, listener as (event: IpcRendererEvent, ...args: any[]) => void ),
        once: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: (event: IpcRendererEvent, ...args: Parameters<T[Channel]>) => unknown
        ) => ipcRenderer.once(channel, listener as (event: IpcRendererEvent, ...args: any[]) => void ),
        removeListener: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            listener: (event: IpcRendererEvent, ...args: Parameters<T[Channel]>) => unknown
        ) => ipcRenderer.removeListener(channel, listener as (event: IpcRendererEvent, ...args: any[]) => void ),
        removeAllListeners: <Channel extends Extract<keyof T, string>>(
            channel: Channel
        ) => ipcRenderer.removeAllListeners(channel),

        // Sender functions
        send: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: Parameters<T[Channel]>
        ) => ipcRenderer.send(channel, ...args),
        invoke: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: Parameters<T[Channel]>
        ): PromiseIfNot<ReturnType<T[Channel]>> =>
            ipcRenderer.invoke(channel, ...args) as PromiseIfNot<ReturnType<T[Channel]>>,
        sendSync: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: Parameters<T[Channel]>
        ) => ipcRenderer.sendSync(channel, ...args),
        sendTo: <Channel extends Extract<keyof T, string>>(
            webContentsId: number,
            channel: Channel,
            ...args: Parameters<T[Channel]>
        ) => ipcRenderer.sendTo(webContentsId, channel, ...args),
        sendToHost: <Channel extends Extract<keyof T, string>>(
            channel: Channel,
            ...args: Parameters<T[Channel]>
        ) => ipcRenderer.sendToHost(channel, ...args)
    }
}

export function createIpcRendererInvokeDispatcher<T extends { [name: string]: (...args: any[]) => Promise<any> }>(dispatch: Dispatch<FSA<string>>, namelist: Array<keyof T>) {
    return createAsyncDispatcher(dispatch, namelist.reduce((acc, name) => {
        return { ...acc, [name]: async (...args: any[]) => await ipcRenderer.invoke(name as string, ...args) }
    }, Object.create(null)))
}