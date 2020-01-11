import { Either } from "fp-ts/lib/Either"

export interface IDLType { [name: string]: any }

const success = Symbol('success')
const error = Symbol('error')

export type SuccessOrError<S, E> = {
    [success]: S,
    [error]: E
}

export type SuccessType<T> = T extends SuccessOrError<unknown, unknown> ? T[typeof success] : T
export type ErrorType<T> = T extends SuccessOrError<unknown, unknown> ? T[typeof error] : never

export type ToEither<T> = T extends SuccessOrError<unknown, unknown> ? Either<ErrorType<T>, SuccessType<T>> : T    