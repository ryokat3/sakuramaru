import React from "react"
import ReactDom from "react-dom"
import { Provider } from "react-redux"
import { Top } from "./component/Top"
import { appStore } from "./appStore"

ReactDom.render(
    <Provider store={appStore}>
        <Top />
    </Provider>,
    document.getElementById("contents")
)
