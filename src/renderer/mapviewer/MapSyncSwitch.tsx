import { FormControlLabel, Switch } from "@material-ui/core"
import React from "react"
import { TopContext } from "./Top"

export interface MapSyncSwitchProps {
    syncMapMove: boolean
}

export const MapSyncSwiitch: React.FunctionComponent<MapSyncSwitchProps> = (props) => {
return <TopContext.Consumer>{(context) => <FormControlLabel control={
        <Switch checked={props.syncMapMove} onChange={ (_) => context.dispatcher.switchSync(!props.syncMapMove) } ></Switch>} label="Sync Map" />
    }</TopContext.Consumer>
}
