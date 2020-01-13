import { pipe } from "fp-ts/lib/pipeable"
import * as TE from "fp-ts/lib/TaskEither"
import { SuccessOrError } from "./IDL"


export type RestSuccess<T> = {
    url: string,
    method: string,
    status: number,
    payload: T
}

export type RestError = {
    url: string,
    method: string,
    status: number,
    data: unknown  
}

export function isFetchApiError(restErr:RestError):boolean {
    return restErr.status < 0
}

export type RestIDL<T> = Promise<SuccessOrError<RestSuccess<T>, RestError>>

export function restTaskEither(url: string, requestInit?: RequestInit) {
    const restInfo = {
        url: url,
        method: requestInit?.method || "GET"
    }
    return pipe(
        TE.tryCatch<RestError,Response>(()=>fetch(url, requestInit), (reason:unknown)=> {            
            return {
                ...restInfo,
                status: -1,
                data: reason               
            }
        }),
        TE.filterOrElse((response:Response)=>response.ok, (response:Response)=>{            
            return {
                ...restInfo,
                status: response.status,
                data: response
            } as RestError
        }),
        TE.map((response:Response)=>{
            return {
                ...restInfo,
                status: response.status,
                payload: response
            } as RestSuccess<Response>
        })
    )
}
