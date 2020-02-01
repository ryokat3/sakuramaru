import { TopStateType, getRightMapImage, getLeftMapImage } from "./TopReducer"

type Point = [ number, number ] // [x, y]
type PointPair = [ Point, Point ]

const angleUnit = 30

export function getSyncPoints(state: TopStateType): Array<[number, number, number, number]> {
    return (state.selectedMap !== undefined) ? ( state.mapData.maps[state.selectedMap].leftMap?.points || [] ) : []
}

function getPairPointListForLeft(points: Array<[number, number, number, number]>): PointPair[] {
    return points.map((point) => [ [ point[0], point[1] ], [ point[2], point[3] ]])
}

function getPairPointListForRight(points: Array<[number, number, number, number]>): PointPair[] {
    return points.map((point) => [ [ point[2], point[3] ], [ point[0], point[1] ] ])
}

function getDistance(point1: Point, point2: Point) {
    return (point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2
}

function getAngle(center: Point, target: Point) {
    return Math.atan2(target[0] - center[0], target[1] - target[1]) * 180 / Math.PI + 180
}

function getAngleGroupIndex(angle: number) {
    return Math.floor(angle / angleUnit)
}

function updateArray<T>(ary: T[], index: number, elem: T): T[] {
    if ((index >= 0) && (index < ary.length)) {
        const newAry = [...ary]
        newAry[index] = elem
        return newAry
    } else {
        return ary
    }
}

function updateAngleGroup(nearPairList: Array<PointPair|undefined>, pair: PointPair, center: Point): Array<PointPair|undefined> {
    const index = getAngleGroupIndex(getAngle(center, pair[0]))
    const nearPair = nearPairList[index]
    if (nearPair === undefined) {
        return updateArray(nearPairList, index, pair)
    } else if (getDistance(center, pair[0]) < getDistance(center, nearPair[0])) {
        return updateArray(nearPairList, index, pair)
    } else {
        return nearPairList
    }
}

function getOpponentWeight(pair: PointPair, center: Point): [Point, number] {
    return [ [pair[1][0] - pair[0][0] + center[0], pair[1][1] - pair[0][1] + center[1] ], (2 ** 20) / Math.sqrt(getDistance(center, pair[0])) ]
}

function adjustPoint(pointMapper:(src:Point)=>Point, src:Point, maxWidth:number, maxHeight:number):PointPair{        
    const dst = pointMapper(src)
    if (dst[0] < 0) {
        return adjustPoint(pointMapper, [src[0] + 1, src[1]], maxWidth, maxHeight)
    }
    else if (dst[0] >= maxWidth) {
        return adjustPoint(pointMapper, [src[0] - 1, src[1]], maxWidth, maxHeight)
    }
    else if (dst[1] < 0) {
        return adjustPoint(pointMapper, [src[0], src[1] + 1], maxWidth, maxHeight)
    }
    else if (dst[1] >= maxHeight) {
        return adjustPoint(pointMapper, [src[0], src[1] - 1], maxWidth, maxHeight)
    }
    else {
        return [src, dst]
    }
}

export function moveRightMap(state: TopStateType, movementX: number, movementY: number): TopStateType {
    const rightMapImage = getRightMapImage(state)
    const leftMapImage = getLeftMapImage(state)
    const rightViewTop = Math.min(Math.max(state.rightView.top - movementX, 0), (rightMapImage !== undefined) ? rightMapImage.height - state.viewHeight : Number.MAX_VALUE)
    const rightViewLeft = Math.min(Math.max(state.rightView.left - movementY, 0), (rightMapImage !== undefined) ? rightMapImage.width - state.viewWidth : Number.MAX_VALUE)

    if ((state.syncMapMove === false) || (leftMapImage === undefined)) {
        return {
            ...state,
            rightView: {
                ...state.rightView,
                left: rightViewLeft,
                top: rightViewTop
                
            }
        }
    }
    else {
        const [rightPoint, leftPoint] = adjustPoint((src:Point)=>getSynchedLeftPoint(state, src), [rightViewLeft, rightViewTop], leftMapImage.width - state.viewWidth, leftMapImage.height - state.viewHeight)
        return {
            ...state,
            rightView: {
                ...state.rightView,
                left: rightPoint[0],
                top: rightPoint[1]                
            },
            leftView: {
                ...state.leftView,
                left: leftPoint[0],
                top: leftPoint[1]
            }          
        }
    }

}

export function moveLeftMap(state: TopStateType, movementX: number, movementY: number): TopStateType {
    const rightMapImage = getRightMapImage(state)
    const leftMapImage = getLeftMapImage(state)
    const leftViewTop = Math.min(Math.max(state.leftView.top - movementX, 0), (leftMapImage !== undefined) ? leftMapImage.height - state.viewHeight : Number.MAX_VALUE)
    const leftViewLeft = Math.min(Math.max(state.leftView.left - movementY, 0), (leftMapImage !== undefined) ? leftMapImage.width - state.viewWidth : Number.MAX_VALUE)

    if ((state.syncMapMove === false) || (rightMapImage === undefined)) {
        return {
            ...state,
            leftView: {
                ...state.leftView,
                left: leftViewLeft,
                top: leftViewTop
            }             
        }
    }
    else {
        const [leftPoint, rightPoint] = adjustPoint((src:Point)=>getSynchedRightPoint(state, src), [leftViewLeft, leftViewTop], rightMapImage.width - state.viewWidth, rightMapImage.height - state.viewHeight)
        return {
            ...state,
            rightView: {
                ...state.rightView,
                left: rightPoint[0],
                top: rightPoint[1]                
            },
            leftView: {
                ...state.leftView,
                left: leftPoint[0],
                top: leftPoint[1]
            }          
        }
    }
}

function getSynchedRightPoint(state: TopStateType, leftPoint:Point ):Point {
    const points = getSyncPoints(state)
    const center: Point = [ leftPoint[0] + (state.viewWidth / 2), leftPoint[1] + (state.viewHeight / 2) ]
    const [pointTotal, weightTotal] = getPairPointListForLeft(points)
            .reduce((neighbors, point) => updateAngleGroup(neighbors, point, center),
                new Array(Math.ceil(360 / angleUnit)).fill(undefined) as Array<PointPair|undefined>)
            .filter((pair) => pair !== undefined)
            .map((x) => getOpponentWeight(x!, center))
            .reduce(([pointTotal, weightTotal], [point, weight]) => [[point[0] * weight + pointTotal[0], point[1] * weight + pointTotal[1]], weight + weightTotal ], [ [0, 0], 0])

    return [ Math.round(pointTotal[0] / weightTotal - (state.viewWidth / 2)), Math.round(pointTotal[1] / weightTotal - (state.viewHeight / 2)) ]            
}

export function getSynchedLeftPoint(state: TopStateType, right:Point):Point {  
    const points = getSyncPoints(state)
    const center: Point = [ right[0] + (state.viewWidth / 2), right[1] + (state.viewHeight / 2)  ]
    const [pointTotal, weightTotal] = getPairPointListForRight(points)
            .reduce((neighbors, point) => updateAngleGroup(neighbors, point, center),
                new Array(Math.ceil(360 / angleUnit)).fill(undefined) as Array<PointPair|undefined>)
            .filter((pair) => pair !== undefined)
            .map((x) => getOpponentWeight(x!, center))
            .reduce(([pointTotal, weightTotal], [point, weight]) => [[point[0] * weight + pointTotal[0], point[1] * weight + pointTotal[1]], weight + weightTotal ], [ [0, 0], 0])

    
    return [ Math.round(pointTotal[0] / weightTotal - (state.viewWidth / 2)), Math.round(pointTotal[1] / weightTotal - (state.viewHeight / 2)) ]
}