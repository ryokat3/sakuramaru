import { FSA } from "flux-standard-action"
import { Dispatch } from "react"
import { FilterObject, SelectObject, MergeType } from "boost-ts"
import { Unpromise } from "./tsUtils"

export interface ActionSetType { [name: string]: any }

export type AsyncActionType<T extends ActionSetType> = SelectObject<T, (...args: any[]) => Promise<any>>
export type SyncActionType<T extends ActionSetType> = FilterObject<SelectObject<T, (...args: any[]) => any>, (...args: any[]) => Promise<any>>


export function createSyncDispatcher<T extends { [name: string]: (...args: any[]) => any }>(dispatch: Dispatch<FSA<string>>, funclist: T): { [Key in keyof T]: (...args: Parameters<T[Key]>) => void } {
    return Object.entries(funclist).reduce((acc, [name, func]) => {
        return {
            ...acc,
            [name]: (...args: Parameters<typeof func>) => dispatch({ type: name, payload: func(...args) })
        }
    }, Object.create(null))
}

export function createAsyncDispatcher<T extends { [name: string]: (...args: any[]) => Promise<any> }>(dispatch: Dispatch<FSA<string>>, funclist: T): { [Key in keyof T]: (...args: Parameters<T[Key]>) => void } {
    return Object.entries(funclist).reduce((acc, [name, func]) => {
        return {
            ...acc,
            [name]: async (...args: Parameters<typeof func>) => dispatch({ type: name, payload: await func(...args) })
        }
    }, Object.create(null))
}

type ReducerCallbackType<Action, State> =
    Action extends (null | undefined | void) ? (state: State, payload?: undefined, error?: boolean, meta?: any) => State
        : Action extends (...args: unknown[]) => unknown ? (state: State, result: Unpromise<ReturnType<Action>>, error?: boolean, meta?: any) => State
        : (state: State, value: Action, error?: boolean, meta?: any) => State

export class Reducer<T extends ActionSetType, State, Keys= never> {
    constructor(
        private readonly reducer: { [Key in keyof T]: ReducerCallbackType<T[Key], State> } = Object.create(null)
    ) {}

    public case<Key extends Exclude<keyof T, Keys>>(key: Key, callback: ReducerCallbackType<T[Key], State>) {
        return new Reducer<T, State, Keys|Key>({
            ...this.reducer,
            [key]: callback
        } as any)
    }

    public combine<T2 extends ActionSetType, State, Keys2>(other:Reducer<T2,State, Keys2>) {
        return new Reducer<MergeType<string,T,T2>,State,Keys|Keys2>({ ...this.reducer, ...other.reducer } as any)
    }

    public build() {
        const reducer = this.reducer
        return function(state: State, action: FSA<string>) {
            const callback = reducer[action.type]
            return (callback !== undefined) ? callback(state, action.payload as any, action.error, action.meta) : state
        }
    }
}
