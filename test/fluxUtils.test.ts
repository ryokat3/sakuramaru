import * as chai from "chai"
import { Reducer } from "../src/utils/fluxUtils"

describe("flusUtils", ()=>{
    it("Reducer combine", ()=>{
        const def1 = {
            item1: null
        }
        const def2 = {
            item2: null
        }

        const reducer1 = new Reducer<typeof def1, number>()
        const reducer2 = new Reducer<typeof def2, number>()

        const combine = reducer1.combine(reducer2)
        
        const reducer = combine.case("item1", (n)=>n+1).case("item2", (n)=>n+2).build()

        chai.assert.equal(reducer(5, { type: "item1"}), 6)
        chai.assert.equal(reducer(5, { type: "item2"}), 7)
    })    
})