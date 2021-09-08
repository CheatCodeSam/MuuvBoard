import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import axios from "axios"
import { BrowserRouter } from "react-router-dom"
import { MainContextProvider } from "./context/MainContext"

axios.defaults.xsrfCookieName = "csrftoken"
axios.defaults.xsrfHeaderName = "X-CSRFToken"

ReactDOM.render(
    <React.StrictMode>
        <MainContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </MainContextProvider>
    </React.StrictMode>,
    document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
