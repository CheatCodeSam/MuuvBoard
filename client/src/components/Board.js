import React from 'react'
import CorkBoard from './CorkBoard'

function Board(props) {

    console.log(props.data)

    return (
        <>
            <h2>{props.data.title}</h2>
            <CorkBoard data={props.data} />
        </>
    )
}

export default Board;