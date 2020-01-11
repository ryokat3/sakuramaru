import { right, left } from "fp-ts/lib/Either"
import { SuccessOrError, ToEither } from "./IDL"
import { Unpromise } from "./tsUtils"

export type RestSuccess<T> = {
    url: string,
    method: string,
    status: number,
    payload: T
}

export type RestError = {
    url: string,
    method: string,
    status: number | "fetch error"
}

export type RestIDL<T> = Promise<SuccessOrError<RestSuccess<T>, RestError>>

export async function rest<T>(url: string, requestInit?: RequestInit): Promise<ToEither<Unpromise<RestIDL<T>>>> {    
    const restInfo = {
        url: url,
        method: requestInit?.method || "GET"
    }

    try {
        const response = await fetch(url, requestInit)
        if (response.ok) {
            return right({
                ...restInfo,
                status: response.status,
                payload: await response.json() as any
            })
        }
        else {            
            return left({
                ...restInfo,
                status: response.status
            })
        }
    }
    catch (e) {        
        return left({
            ...restInfo,
            status: "fetch error"
        })
    }
}

