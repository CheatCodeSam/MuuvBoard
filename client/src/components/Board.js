import React from "react"
import CorkBoard from "./CorkBoard"
import axios from "axios"
import { MainContext } from "../context/MainContext"

class Board extends React.Component {
    static contextType = MainContext
    constructor(props) {
        super(props)
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${props.match.params.BoardId}/`
        this.state = { loading: true, board: null }
    }

    componentDidMount() {
        axios
            .get(this.url, {
                headers: {
                    Authorization: `token ${this.context.token}`,
                },
            })
            .then(response =>
                this.setState({ loading: false, board: response.data })
            )
    }

    render() {
        if (this.state.loading) {
            return <h1> Loading </h1>
        } else {
            return (
                <>
                    <CorkBoard
                        data={this.state.board}
                        token={this.context.token}
                    />
                </>
            )
        }
    }
}

export default Board
