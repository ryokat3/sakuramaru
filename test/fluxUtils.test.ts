import * as chai from "chai"
import { Either, left, right } from "fp-ts/lib/Either"
import { Dispatcher, Reducer } from "../src/utils/FdtFlux"

type ActionDesign = {
    "async": (val1: string, val2: number) => Promise<string>,
    "sync": (val: string) => string,
    "noparam": void,
    "paramBool": boolean,
    "paramString": string,
    "either": () => Either<number, string>,
    "eitherPromise": () => Promise<Either<number,string>>
}

describe("fluxUtils", () => {
    it("action with parameter", () => {

        const dispatcher = new Dispatcher<ActionDesign>()
            .addAction("noparam")
            .addAsyncAction("async", async (val1: string, val2: number) => `${val1}${val2}`)
            .addSyncAction("sync", (val1: string) => val1)
            .addParameterAction("paramBool")
            .addParameterAction("paramString")
            .addSyncAction("either", () => right("hello"))
            .addAsyncAction("eitherPromise", async () => left(10))
            .build((x) => x)

        chai.assert.equal(Object.keys(dispatcher).length, 7)
    })
    it("Reducer basic", () => {

        const reducer = new Reducer<ActionDesign, string>()
            .add("noparam", (state: string) => `${state}_1`)
            .add("sync", (state: string, payload) => `${state}_${payload}`)
            .build()

        chai.assert.equal(reducer("Hello", { type: "noparam" }), "Hello_1")
        chai.assert.equal(reducer("Hello", { type: "sync", payload: "hehe"}), "Hello_hehe")
    })

    it("Dispatcher basic", () => {
        const dispatcher = new Dispatcher<ActionDesign>()
            .addAction("noparam")
            .addAsyncAction("async", async (val1: string, val2: number) => `${val1}${val2}`)
            .addSyncAction("sync", (val1: string) => val1)
            .addParameterAction("paramBool")
            .addParameterAction("paramString")
            .addSyncAction("either", () => right("hello"))
            .addAsyncAction("eitherPromise", async () => left(10))
            .build((x) => x)

        const keys = Array.from(Object.keys(dispatcher))

        chai.assert.equal(keys.length, 7)
    })

    it("Reducer Either", () => {
        const reducer = new Reducer<ActionDesign, string>()
            .add("either", (state: string, value: string) => `${state}_${value}`)            
            .addError("either", (state: string, value: number) => `${state}_${value + 1}`)            
            .add("eitherPromise", (state: string, value: string) => `${state}_${value}`)
            .addError("eitherPromise", (state: string, value: number) => `${state}_${value + 1}`)            
            .build()

        chai.assert.equal(reducer("Hello", { type: "either", payload: "true" }), "Hello_true")
        chai.assert.equal(reducer("Hello", { type: "either", payload: 10, error: true }), "Hello_11")

        chai.assert.equal(reducer("Hello", { type: "eitherPromise", payload: "true" }), "Hello_true")
        chai.assert.equal(reducer("Hello", { type: "eitherPromise", payload: 10, error: true }), "Hello_11")
    })
})
