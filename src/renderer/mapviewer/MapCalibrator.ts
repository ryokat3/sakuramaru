import { TopStateType } from "./TopReducer"

type Point = [ number, number ]
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

export function moveRightMap(state: TopStateType, movementX: number, movementY: number): TopStateType {
    return {
        ...state,
        rightMapView: {
            ...state.rightMapView,
            top: Math.max(state.rightMapView.top - movementX, 0),
            left: Math.max(state.rightMapView.left - movementY, 0)
        }
    }
}

export function moveLeftMap(state: TopStateType, movementX: number, movementY: number): TopStateType {
    return {
        ...state,
        leftMapView: {
            ...state.leftMapView,
            top: Math.max(state.leftMapView.top - movementX, 0),
            left: Math.max(state.leftMapView.left - movementY, 0)
        }
    }
}

export function calibrateRightMap(state: TopStateType): TopStateType {
    const points = getSyncPoints(state)
    const center: Point = [ state.leftMapView.top + (state.mapHeight / 2), state.leftMapView.left + (state.mapWidth / 2) ]
    const [pointTotal, weightTotal] = getPairPointListForLeft(points)
            .reduce((neighbors, point) => updateAngleGroup(neighbors, point, center),
                new Array(Math.ceil(360 / angleUnit)).fill(undefined) as Array<PointPair|undefined>)
            .filter((pair) => pair !== undefined)
            .map((x) => getOpponentWeight(x!, center))
            .reduce(([pointTotal, weightTotal], [point, weight]) => [[point[0] * weight + pointTotal[0], point[1] * weight + pointTotal[1]], weight + weightTotal ], [ [0, 0], 0])

    return {
        ...state,
        rightMapView: {
            ...state.rightMapView,
            top: Math.round(pointTotal[0] / weightTotal - (state.mapHeight / 2)),
            left: Math.round(pointTotal[1] / weightTotal - (state.mapWidth / 2))
        }
    }
}

export function calibrateLeftMap(state: TopStateType): TopStateType {
    const points = getSyncPoints(state)
    const center: Point = [ state.rightMapView.top + (state.mapHeight / 2), state.rightMapView.left + (state.mapWidth / 2) ]
    const [pointTotal, weightTotal] = getPairPointListForRight(points)
            .reduce((neighbors, point) => updateAngleGroup(neighbors, point, center),
                new Array(Math.ceil(360 / angleUnit)).fill(undefined) as Array<PointPair|undefined>)
            .filter((pair) => pair !== undefined)
            .map((x) => getOpponentWeight(x!, center))
            .reduce(([pointTotal, weightTotal], [point, weight]) => [[point[0] * weight + pointTotal[0], point[1] * weight + pointTotal[1]], weight + weightTotal ], [ [0, 0], 0])

    return {
        ...state,
        leftMapView: {
            ...state.leftMapView,
            top: Math.round(pointTotal[0] / weightTotal - (state.mapHeight / 2)),
            left: Math.round(pointTotal[1] / weightTotal - (state.mapWidth / 2))
        }
    }
}
