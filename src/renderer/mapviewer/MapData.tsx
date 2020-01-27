import React from "react"
import { MapDataType } from "../../MapData"

export interface MapDataProps {
    data: MapDataType["data"]
}

export const MapData: React.FunctionComponent<MapDataProps> = (props: MapDataProps) => {
    return <MapDataNotice notice={props.data.notice}></MapDataNotice>
}

export interface MapDataNoticeProps {
    notice?: string | string[]
}

export const MapDataNotice: React.FunctionComponent<MapDataNoticeProps> = (props: MapDataNoticeProps) => {
    if (props.notice === undefined) {
        return <></>
    } else if (typeof props.notice === "string") {
        return <p>{props.notice}</p>
    } else {
        return <ul>{props.notice.map((s) => {
            return <li>{s}</li>
        })}</ul>
    }
}
