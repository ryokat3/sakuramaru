import { Point } from "./MapCalibrator"

function toRadian(degree:number) { return (degree / 180) * Math.PI }
function toDegree(radian:number) { return (radian * 180) / Math.PI }
function distance(p:Point) { return Math.sqrt((p[0] ** 2) + (p[1] ** 2)) }

export function rotate(p:Point, d:number):Point {
    const degree = toDegree(Math.atan2(p[1], p[0])) + d
    const len = distance(p)
    return [ len * Math.cos(toRadian(degree)), len * Math.sin(toRadian(degree)) ]
}

export function direction(root:Point, p:Point, d:number):number {
    const newP = rotate(p, d)
    return Math.atan2(newP[1] - root[1], newP[0] - root[0])
}

export function stat(data:[Point, Point][], d:number):number {
    const directList = data.map(([root, p])=>direction(root, p, d))
    const ave = directList.reduce((acc, direct)=>acc + direct, 0) / directList.length
    return directList.reduce((acc, direct)=>acc + (direct - ave) ** 2, 0)
}
