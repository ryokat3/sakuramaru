import * as chai from "chai"
import { rotate, direction, stat } from "../src/renderer/mapviewer/MapAngle"

function round2(x:number):number { return Math.round(x * 100) / 100 }


describe("MapAngle", ()=>{
    it("rotate", ()=>{
        chai.assert.deepEqual(rotate([5, 0], 90).map(round2), [0, 5])
        chai.assert.deepEqual(rotate([5, 0], 180).map(round2), [-5, 0])
    })

    it("direction", ()=>{
        chai.assert.equal(direction([0, 0], [1, 0], 90), Math.PI/2)
        chai.assert.equal(direction([0, 0], [1, 0], 45), Math.PI/4)
        chai.assert.equal(round2(direction([0, 0], [1, 0], 270)), round2(- Math.PI/2))
    })

    it("stat", ()=>{
        const points:[[number, number], [number, number]][] = [
            [ [1593, 2630], [614, 2596] ],
            [ [1631, 2908], [651, 2876] ],
            [ [1490, 3240], [516, 3201] ],
            [ [1748, 114], [759, 70] ],
            [ [1006, 326], [9, 284] ],
            [ [2073, 5453], [1086, 5419] ],
            [ [2166, 134], [1179, 92] ]
        ]
        console.log(stat(points, 0))
        console.log(stat(points, 90))
        console.log(stat(points, 180))
        console.log(stat(points, 270))
        console.log(stat(points, 360))
    })

    it("stat 90", ()=>{
        const points:[[number, number], [number, number]][] = [
            [ [2568, 1219], [2572, 1852] ],
            [ [437, 1694], [448, 2381] ],
            [ [2267, 1613], [2280, 2260] ],
            [ [2099, 1003], [2098, 1651] ],
            [ [2599, 438], [2586, 1076] ],
            [ [1135, 2137], [1159, 2810] ],
            [ [723, 2105], [748, 2788] ],
            [ [1724, 2237], [1751, 2896] ],
            [ [3177, 232], [3156, 849] ]
        ]
        console.log(stat(points, 0))
        console.log(stat(points, 90))
        console.log(stat(points, 180))
        console.log(stat(points, 270))
        console.log(stat(points, 360))
    })
})