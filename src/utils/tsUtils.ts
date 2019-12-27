export type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P]
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export type PromiseIfNot<T> = T extends Promise<any> ? T : Promise<T>

export type Unpromise<T> = T extends Promise<infer U> ? U : T

export type PromiseUnion<T> = Unpromise<T> | Promise<Unpromise<T>>
