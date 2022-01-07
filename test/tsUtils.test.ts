import * as chai from "chai"
import { Either } from "fp-ts/lib/Either"
import { ErrorType, Unpromise, PromiseUnion, ValueType } from "../src/utils/tsUtils"

describe("tsUtils", () => {
    it("ErrorType", () => {
        let a:ErrorType<Unpromise<Either<string,number>>> = "hello"
        chai.assert.equal(a, "hello")
    })

    it("Unpromise", () => {        
        let d: Unpromise<ReturnType<() => Promise<number>>> = 5
        chai.assert.equal(d, 5)

        let e: Unpromise<ReturnType<() => number>> = 5
        chai.assert.equal(d, e)
    })
    
    it("PromiseUnion", () => {        
        let d: PromiseUnion<ReturnType<() => Promise<number>>> = 5
        chai.assert.equal(d, 5)
    })

    it("ValueType", () => {
        let d: ValueType<number> = 5
        chai.assert.equal(d, 5)

        let e: ValueType<Either<string,number>> = 5
        chai.assert.equal(e, 5)
    })
})