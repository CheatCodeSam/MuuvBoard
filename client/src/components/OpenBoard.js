import React from 'react'
import Board from './Board'

function OpenBoard(props) {

    console.log(props.data)

    return (
        <>
            <h2>{props.data.title}</h2>
            <Board data={props.data} />
        </>
    )
}

export default OpenBoard;