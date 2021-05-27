import React, { useEffect, useState, component } from "react";
import {
    useParams,
    Link
} from "react-router-dom";

import axios from 'axios'
import CreateBoard from "./CreateBoard";


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
                        <Link to={`/board/${board.id}/`}>{board.title} - {board.id}</Link>
                    </li>)
                })
            )
        }
    }

    const handleCreation = (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        try {
            axios.post(url, formData).then((data) => {
                const board = data.data
                const newList = appState.boards.concat(board);
                setAppState({
                    loading: appState.loading,
                    boards: newList
                })
            });
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }

    }

    return (
        <>
            {
                <ul>
                    {loadBoards()}
                </ul>
            }
            < CreateBoard onSubmit={handleCreation} />
        </>
    )
}

export default ListOfBoards;