import React from "react"

export interface MapPointsProps {        
    topL: number,
    leftL: number,
    topR: number,
    leftR: number
}

export const MapPoints: React.FunctionComponent<MapPointsProps> = (props: MapPointsProps) => {
    return <div>{`[ ${props.topL}, ${props.leftL}, ${props.topR}, ${props.leftR} ]`}</div>    
}    
