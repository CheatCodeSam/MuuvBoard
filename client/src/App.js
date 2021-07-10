import './App.css';
import { Switch, Route } from "react-router-dom";

import Board from './components/Board';

import ListOfBoards from './components/ListOfBoards'

import LogIn from './components/LogIn';
import { useContext } from 'react';
import { MainContext } from './context/MainContext';



function App() {
    const { token } = useContext(MainContext)

    if (!token) {
        return <LogIn />
    }

    return (
        <>
            <Switch>
                <Route path="/board/:BoardId/" component={Board} />
                <Route path="/board/:BoardId/" component={Board} />
                <Route path="/" component={ListOfBoards} />
            </Switch>
        </>
    );
}



export default App;