import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import React from "react"
import { MapDataType } from "../../MapData"
import { TopContext } from "./Top"
import { TopStateType, getLeftViewFile } from "./TopReducer"


export interface MapSelectorProps {
    mapData: MapDataType
    mapImage: { [fileName: string]: HTMLImageElement }
    mapFile?: string,
    overlap: TopStateType["overlap"]
}

function getMenuList(mapData:MapDataType["maps"]):[string, { fileName: string, overlap: TopStateType["overlap"] }][] {
    return Object.entries(mapData).reduce((menuList, [key, value])=>{
        if (value.leftMap !== undefined) {
            menuList.push([value?.description || key, { fileName: key, overlap: "left" } ])
        }
        if (value.upperMap !== undefined) {
            menuList.push([`${value?.description || key} (upper)`, { fileName: key, overlap: "upper" } ])
        }
        return menuList
    }, [] as [string, { fileName: string, overlap: TopStateType["overlap"]}][])
}

export const MapSelector: React.FunctionComponent<MapSelectorProps> = (props: MapSelectorProps) => {

    return <TopContext.Consumer>{(context) =>
        <FormControl sx={{
                margin: (theme) => theme.spacing(1),
                minWidth: 120
            }}>
            <InputLabel>Map</InputLabel>
            <Select value={props.mapFile} onChange={(e) => {
                const rightMapData = JSON.parse(e.target.value as string) as { fileName: string, overlap: TopStateType["overlap"] }
                context.dispatcher.selectMap(rightMapData)
                if (props.mapImage[rightMapData.fileName] === undefined) {
                    context.dispatcher.getMap(context.appConfig, rightMapData.fileName)
                }
                const leftViewFile= getLeftViewFile(props.mapData, rightMapData.fileName, rightMapData.overlap)
                if ((leftViewFile !== undefined) && (props.mapImage[leftViewFile] === undefined)) {
                    context.dispatcher.getMap(context.appConfig, leftViewFile)
                }
            }}>
            { getMenuList(props.mapData.maps).map(([description, value], idx) => <MenuItem key={idx} value={JSON.stringify(value)}>{description}</MenuItem>) }
            </Select>
        </FormControl>
    }</TopContext.Consumer>
}
