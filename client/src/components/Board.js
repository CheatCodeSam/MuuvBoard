import React from 'react'
import CorkBoard from './CorkBoard'
import Toolbar from './Toolbar'
import axios from 'axios'

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${props.match.params.BoardId}/pins/`;
        this.state = { loading: true, board: null };
    }

    componentDidMount() {
        axios.get(this.url).then(response => this.setState({ loading: false, board: response.data }));
    }

    render() {
        if (this.state.loading) {
            return <h1> Loading </h1>
        } else {
            return (
                <>
                    <Toolbar title={this.state.board.title} />
                    <CorkBoard data={this.state.board} />
                </>
            )
        }
    }
}


export default Board;