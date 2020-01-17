export type ADL = Payload<unknown,unknown> | ((...args:any[])=>Payload<unknown,unknown>) | ((...args:any[])=>Promise<Payload<unknown,unknown>> ) 

const success = Symbol("success")
const error = Symbol("error")

export interface Payload<S = never, E = never> {
    [success]: S,
    [error]: E
}

export type ValueType<T extends Payload<unknown, unknown>> = T[typeof success]
export type ErrorType<T extends Payload<unknown, unknown>> = T[typeof error]

