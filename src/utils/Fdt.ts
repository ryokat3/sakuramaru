export type FdtValue = Payload<unknown,unknown>
export type FdtAsync = ((...args:any[])=>Promise<Payload<unknown,unknown>> ) 
export type FdtSync = ((...args:any[])=>Payload<unknown,unknown>)

export type Fdt = FdtValue | FdtSync | FdtAsync


const success = Symbol("success")
const error = Symbol("error")

export interface Payload<S = never, E = never> {
    [success]: S,
    [error]: E
}

export type ValueType<T extends Payload<unknown, unknown>> = T[typeof success]
export type ErrorType<T extends Payload<unknown, unknown>> = T[typeof error]

