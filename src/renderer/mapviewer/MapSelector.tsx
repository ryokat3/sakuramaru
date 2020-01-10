import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import React from "react"
import { MapDataType } from "../../MapData"
import { TopContext } from "./Top"

export interface MapSelectorProps {
    mapData: MapDataType
    mapFile?: string
}

export const MapSelector: React.FunctionComponent<MapSelectorProps> = (props: MapSelectorProps) => {

    return <TopContext.Consumer>{(context) =>
        <FormControl className={context.style.formControl}>
            <InputLabel>Map</InputLabel>
            <Select value={props.mapFile} onChange={(e) => context.dispatcher.selectMap(e.target.value as string)}>
                { Object.entries(props.mapData).map(([key, value]) => <MenuItem value={key}>{value?.description || key}</MenuItem>) }
            </Select>
        </FormControl>
    }</TopContext.Consumer>
}
