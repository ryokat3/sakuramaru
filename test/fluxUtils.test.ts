import * as chai from "chai"
import { Dispatcher, Reducer } from "../src/utils/TypedFlux"

interface ActionDesign {
    "async": (val1: string, val2: number) => Promise<string>,
    "sync": (val: string) => string,
    "noparam": void,
    "paramBool": boolean,
    "paramString": string
}

describe("flusUtils", () => {
    it("Reducer basic", () => {

        const reducer1 = new Reducer<ActionDesign, string>()
            .add("noparam", (state: string) => `${state}_1`)
            .add("sync", (state: string, payload) => `${state}_${payload}`)
            .build()

        chai.assert.equal(reducer1("Hello", { type: "noparam" }), "Hello_1")
        chai.assert.equal(reducer1("Hello", { type: "sync", payload: "hehe"}), "Hello_hehe")
    })

    it("Dispatcher basic", () => {
        const dispatcher = new Dispatcher<ActionDesign>()
            .addAction("noparam")
            .addAsyncAction("async", async (val1: string, val2: number) => `${val1}${val2}`)
            .addSyncAction("sync", (val1: string) => val1)
            .addParameterAction("paramBool")
            .addParameterAction("paramString")
        const keys = Array.from(Object.keys(dispatcher.build(undefined as any)))
        console.log(keys)

        chai.assert.equal(keys.length, 5)
    })
})
