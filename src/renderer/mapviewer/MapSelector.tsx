import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import React from "react"
import { MapDataType } from "../../MapData"
import { TopContext } from "./Top"

export interface MapSelectorProps {
    mapData: MapDataType
    mapImage: { [fileName: string]: HTMLImageElement }
    mapFile?: string
}

export const MapSelector: React.FunctionComponent<MapSelectorProps> = (props: MapSelectorProps) => {

    return <TopContext.Consumer>{(context) =>
        <FormControl className={context.style.formControl}>
            <InputLabel>Map</InputLabel>
            <Select value={props.mapFile} onChange={(e) => {
                const rightMapFile = e.target.value as string   
                context.dispatcher.selectMap(rightMapFile)
                if (props.mapImage[rightMapFile] === undefined) {
                    context.dispatcher.getMap(context.appConfig, rightMapFile)
                }
                const leftMapFile = props.mapData.maps[rightMapFile].leftMap?.fileName
                if ((leftMapFile !== undefined) && (props.mapImage[leftMapFile] === undefined)) {
                    context.dispatcher.getMap(context.appConfig, leftMapFile)
                }
            }}>
                { Object.entries(props.mapData.maps).map(([key, value]) => <MenuItem key={key} value={key}>{value?.description || key}</MenuItem>) }
            </Select>
        </FormControl>
    }</TopContext.Consumer>
}
