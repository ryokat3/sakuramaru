import React from "react"

export interface MapPointsProps {
    topL: number,
    leftL: number,
    topR: number,
    leftR: number
}

export const MapPoints: React.FunctionComponent<MapPointsProps> = (props: MapPointsProps) => {
    return <div>{`[ ${Math.round(props.leftL)}, ${Math.round(props.topL)}, ${Math.round(props.leftR)}, ${Math.round(props.topR)} ]`}</div>
}
