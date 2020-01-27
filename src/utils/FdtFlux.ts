import { FilterObject, SelectObject } from "boost-ts"
import { FSA } from "flux-standard-action"
import { Either, isLeft, isRight } from "fp-ts/lib/Either"
import { Dispatch } from "react"
import { ErrorType, Fdt, Payload, ValueType } from "./Fdt"
import { PromiseUnion, Unpromise } from "./tsUtils"

////////////////////////////////////////////////////////////////////////
/// Dispatcher
////////////////////////////////////////////////////////////////////////

type DispatchArgsType<T extends Fdt> = T extends Payload<void|null|undefined|never, unknown> ? []
        : T extends Payload<unknown, unknown> ? [ ValueType<T> ]
        : T extends (...args: any[]) => unknown ? Parameters<T>
        : never

type DispatchReterunType<T extends Fdt> = T extends ((...args: any[]) => Promise<any>) ? Promise<void> : void

type DispatchFunctionType<T extends Fdt> = (...args: DispatchArgsType<T>) => DispatchReterunType<T>

type ToEither<T> = T extends Payload<unknown, never> ? ValueType<T> : T extends Payload<unknown, unknown> ? Either<ErrorType<T>, ValueType<T>> : never

export class Dispatcher<T extends { [type: string]: Fdt }, Keys extends keyof T = never> {
    constructor(
        private readonly dispatcher: { [Key in keyof T]: (dispatch: Dispatch<FSA<string>>) => DispatchFunctionType<T[Key]> } = Object.create(null)
    ) {}

    public addAction<Key extends keyof SelectObject<{ [LtdKey in Exclude<keyof T, Keys>]: T[LtdKey] }, Payload<void|unknown|undefined|never>>>(key: Key) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string>>) => () => dispatch({ type: key as string })
        })
    }

    public addParameterAction<Key extends keyof FilterObject<{ [LtdKey in Exclude<keyof T, Keys>]: T[LtdKey] }, ((...args: any[]) => any) >>(key: Key) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string, unknown>>) => (payload: ValueType<T[Key]>) => dispatch({ type: key as string, payload })
        })
    }

    public addSyncAction<Key extends keyof FilterObject<SelectObject<{ [LtdKey in Exclude<keyof T, Keys>]: T[LtdKey] }, (...args: any[]) => any >, (...args: any[]) => Promise<any> >>(
        key: Key,
        func: (...args: Parameters<T[Key]>) => ToEither<ReturnType<T[Key]>>
    ) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string, unknown>>) => (...args: Parameters<T[Key]>) => {
                const payload = func(...args)
                if (isLeft(payload)) {
                    dispatch({ type: key as string, payload: payload.left, error: true })
                } else if (isRight(payload)) {
                    dispatch({ type: key as string, payload: payload.right, error: false })
                } else {
                    dispatch({ type: key as string, payload })
                }
            }
        })
    }

    public addAsyncAction<Key extends keyof SelectObject<{ [LtdKey in Exclude<keyof T, Keys>]: T[LtdKey] }, (...args: any[]) => Promise<any>>>(
        key: Key,
        func: (...args: Parameters<T[Key]>) => Promise<ToEither<Unpromise<ReturnType<T[Key]>>>>
    ) {
        return new Dispatcher<T, Keys|Key>({
            ...this.dispatcher,
            [key]: (dispatch: Dispatch<FSA<string, unknown>>) => async (...args: Parameters<T[Key]>) => {
                const payload = await func(...args)
                if (isLeft(payload)) {
                    dispatch({ type: key as string, payload: payload.left, error: true })
                } else if (isRight(payload)) {
                    dispatch({ type: key as string, payload: payload.right, error: false })
                } else {
                    dispatch({ type: key as string, payload })
                }
            }
        })
    }

    public build(dispatch: Dispatch<FSA<string>>): { [Key in Keys]: DispatchFunctionType<T[Key]> } {
        return Object.entries(this.dispatcher).reduce((acc, [key, func]) => {
            return {
                ...acc,
                [key]: func(dispatch)
            }
        }, Object.create(null))
    }
}

export type DispatcherType<D> =  D extends Dispatcher<infer T, infer Keys> ? { [Key in Keys]: DispatchFunctionType<T[Key]> } : never

////////////////////////////////////////////////////////////////////////
/// Reducer
////////////////////////////////////////////////////////////////////////

type ReducerPayloadType<T extends Fdt> = T extends Payload<void|null|undefined|never, unknown> ? never
        : T extends Payload<unknown, unknown> ? ValueType<T>
        : T extends (...args: any[]) => PromiseUnion<Payload<any, any>> ? ValueType<Unpromise<ReturnType<T>>>
        : never

type ReducerErrorPayloadType<T extends Fdt> =
    T extends ((...args: any[]) => PromiseUnion<Payload<any, any>>) ? ErrorType<Unpromise<ReturnType<T>>> : never

type ReducerCallbackType<State, PayloadType> = (state: State, payload: PayloadType, error?: boolean, meta?: any) => State

type ErrorKeysList<T extends { [type: string]: Fdt }> = keyof SelectObject<T, (...args: any[]) => PromiseUnion<Payload<any, any>>>

export class Reducer<T extends { [type: string]: Fdt },
        State,
        Keys extends keyof T = never,
        ErrorKeys extends ErrorKeysList<T> = never
> {
    constructor(
        private readonly reducer: { [Key in keyof T]: ReducerCallbackType<State, ReducerPayloadType<T[Key]>> } = Object.create(null),
        private readonly errorReducer: { [Key in keyof T]: ReducerCallbackType<State, ReducerErrorPayloadType<T[Key]>> } = Object.create(null)
    ) {}

    public add<Key extends Exclude<keyof T, Keys>>(
        key: Key,
        callback: ReducerCallbackType<State, ReducerPayloadType<T[Key]>>
    ) {
        return new Reducer<T, State, Keys|Key, ErrorKeys>({
            ...this.reducer,
            [key]: callback
        }, this.errorReducer)
    }

    public addError<ErrorKey extends Exclude<ErrorKeysList<T>, ErrorKeys> & ErrorKeysList<T>>(
        key: ErrorKey,
        errorCallback: ReducerCallbackType<State, ReducerErrorPayloadType<T[ErrorKey]>>
    ) {
        return new Reducer<T, State, Keys, ErrorKeys|ErrorKey>(this.reducer, {
            ...this.errorReducer,
            [key]: errorCallback
        })
    }

    public build() {
        const reducer = this.reducer
        const errorReducer = this.errorReducer
        return (state: State, action: FSA<string, any>) => {
            const callback = (action.error === true) ? errorReducer[action.type] : reducer[action.type]
            return (callback !== undefined) ? callback(state, action.payload as any, action.error, action.meta) : state
        }
    }
}
