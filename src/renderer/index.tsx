import React from "react"
import ReactDom from "react-dom"
import { Provider } from 'react-redux'
import { store } from './store'
import { Top } from "./component/Top"


ReactDom.render(
    <Provider store={store}>
        <Top />    
    </Provider>,
    document.getElementById("contents")    
)
