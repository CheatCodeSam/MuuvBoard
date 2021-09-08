import React, { useState } from "react"

const MainContext = React.createContext()

function MainContextProvider({ children }) {
    const [token, setToken] = useState("")

    return (
        <MainContext.Provider value={{ token, setToken }}>
            {children}
        </MainContext.Provider>
    )
}

export { MainContextProvider, MainContext }
