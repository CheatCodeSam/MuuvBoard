import React from 'react'
import Board from './Board';
import { useState, useEffect } from 'react'
import {
    useParams
} from "react-router-dom";

import axios from 'axios'



function BoardLoader(props) {

    let { BoardId } = useParams();

    const url = `${process.env.REACT_APP_BASE_URL}/api/boards/${BoardId}/pins/`

    const [appState, setAppState] = useState({
        loading: false,
        board: null,
    });

    useEffect(() => {
        setAppState({ loading: true });
        axios.get(url).then((response) => {
            const collectedPins = response.data;
            setAppState({ loading: false, board: collectedPins });
        });
    }, [setAppState]);


    return (
        <>
            {appState.board && <Board data={appState.board} />}
        </>
    )

}

export default BoardLoader;