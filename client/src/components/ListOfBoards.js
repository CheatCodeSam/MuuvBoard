import React, { useEffect, useState, component } from "react";
import {
    useParams,
    Link
} from "react-router-dom";

import axios from 'axios'


function ListOfBoards(props) {



    const url = `${process.env.REACT_APP_BASE_URL}/api/boards/`

    const [appState, setAppState] = useState({
        loading: false,
        boards: null,
    });

    useEffect(() => {
        setAppState({ loading: true });
        axios.get(url).then((response) => {
            const loadedBoards = response.data;
            setAppState({ loading: false, boards: loadedBoards });
        });
    }, [setAppState, url]);

    const loadBoards = () => {
        if (!appState.boards) {
            return <h1> loading </h1>
        }
        else {
            return (
                appState.boards.map((board) => {
                    return (<li key={board.id}>
                        <Link to={`/board/${board.id}/`}>Board {board.id}</Link>
                    </li>)
                })
            )
        }
    }

    return (
        <>
            {
                <ul>
                    {loadBoards()}
                </ul>
            }
        </>
    )
}

export default ListOfBoards;