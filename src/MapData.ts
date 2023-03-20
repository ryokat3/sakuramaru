export type MapData = {
    description?: string
    leftMap?: {
        fileName: string,
        points: [number, number, number, number][] // [leftX, leftY, rightX, rightY]
    },
    upperMap?: {
        fileName: string,
        points: [number, number, number, number][] // [leftX, leftY, rightX, rightY]
    }

}

export type MapDataType = {
    maps: {
        [fileName: string]: MapData
    },
    data: {
        notice?: string | string[]
    }
}