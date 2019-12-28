import { FilterObject, SelectObject } from "boost-ts"
import { FSA } from "flux-standard-action"
import { Dispatch } from "react"
import { Unpromise } from "./tsUtils"

export interface ActionSetType { [name: string]: any }

type DispatcherType<Action> =
    Action extends (null | undefined | void | never) ? () => void
        : Action extends (...args: unknown[]) => Promise<unknown> ? (...args: Parameters<Action>) => Promise<void>
        : Action extends (...args: unknown[]) => unknown ? (...args: Parameters<Action>) => void
        : (value: Action) => void

export class Dispatcher<T extends ActionSetType, Keys extends keyof T = never> {
    constructor(
        private readonly dispatcher: { [Key in keyof T]: (dispatch: Dispatch<FSA<string>>) => DispatcherType<T[Key]> } = Object.create(null)
    ) {}

    public addAction<Key extends keyof SelectObject<{ [Key in Exclude<keyof T, Keys>]: T[Key] }, null | undefined | void >>(key: Key) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string>>) => () => dispatch({ type: key as string })
        })
    }

    public addParameterAction<Key extends keyof FilterObject<{ [Key in Exclude<keyof T, Keys>]: T[Key] }, ((...args: any[]) => any) >>(key: Key) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string>>) => (payload: T[Key]) => dispatch({ type: key as string, payload })
        })
    }

    public addSyncAction<Key extends keyof FilterObject<SelectObject<{ [Key in Exclude<keyof T, Keys>]: T[Key] }, (...args: any[]) => any >, (...args: any[]) => Promise<any> >>(key: Key, func: T[Key]) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string>>) => (...args: Parameters<T[Key]>) => dispatch({ type: key as string, payload: func(...args) })
        })
    }

    public addAsyncAction<Key extends keyof SelectObject<{ [Key in Exclude<keyof T, Keys>]: T[Key] }, (...args: any[]) => Promise<any>>>(key: Key, func: T[Key]) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string>>) => async (...args: Parameters<T[Key]>) => dispatch({ type: key as string, payload: await func(...args) })
        })
    }

    public build(dispatch: Dispatch<FSA<string>>): { [Key in Keys]: DispatcherType<T[Key]> } {
        return Object.entries(this.dispatcher).reduce((acc, [key, func]) => {
            return {
                ...acc,
                [key]: func(dispatch)
            }
        }, Object.create(null))
    }
}

type ReducerCallbackType<Action, State> =
    Action extends (null | undefined | void) ? (state: State, payload?: undefined, error?: boolean, meta?: any) => State
        : Action extends (...args: unknown[]) => unknown ? (state: State, result: Unpromise<ReturnType<Action>>, error?: boolean, meta?: any) => State
        : (state: State, value: Action, error?: boolean, meta?: any) => State

export class Reducer<T extends ActionSetType, State, Keys extends keyof T = never> {
    constructor(
        private readonly reducer: { [Key in keyof T]: ReducerCallbackType<T[Key], State> } = Object.create(null)
    ) {}

    public add<Key extends Exclude<keyof T, Keys>>(key: Key, callback: ReducerCallbackType<T[Key], State>) {
        return new Reducer<T, State, Keys|Key>({
            ...this.reducer,
            [key]: callback
        } as any)
    }

    public build() {
        const reducer = this.reducer
        return function(state: State, action: FSA<string, any>) {
            const callback = reducer[action.type]
            return (callback !== undefined) ? callback(state, action.payload as any, action.error, action.meta) : state
        }
    }
}
