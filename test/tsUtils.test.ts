import * as chai from "chai"
import { Either } from "fp-ts/lib/Either"
import { ErrorType, Unpromise, PromiseUnion, ValueType } from "../src/utils/tsUtils"

describe("tsUtils", () => {
    it("ErrorType", () => {
        const a:ErrorType<Unpromise<Either<string,number>>> = "hello"
        chai.assert.equal(a, "hello")
    })

    it("Unpromise", () => {
        const d: Unpromise<ReturnType<() => Promise<number>>> = 5
        chai.assert.equal(d, 5)

        const e: Unpromise<ReturnType<() => number>> = 5
        chai.assert.equal(d, e)
    })

    it("PromiseUnion", () => {
        const d: PromiseUnion<ReturnType<() => Promise<number>>> = 5
        chai.assert.equal(d, 5)
    })

    it("ValueType", () => {
        const d: ValueType<number> = 5
        chai.assert.equal(d, 5)

        const e: ValueType<Either<string,number>> = 5
        chai.assert.equal(e, 5)
    })
})