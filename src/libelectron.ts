import { ipcMain } from "electron"
export interface typedEvent  {
    [channel:string]: [ unknown[], unknown ]
}

function ipcMainTyped_on<T extends typedEvent>(
    channel:keyof T,
    listener:(...args:T[typeof channel][0])=>T[typeof channel][1]) {
    return ipcMain.on(channel as string, listener)
}

export const ipcMainTyped = {
    on: ipcMainTyped_on
}