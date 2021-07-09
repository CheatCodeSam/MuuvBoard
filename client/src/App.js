import './App.css';
import { Switch, Route } from "react-router-dom";

import Board from './components/Board';

import ListOfBoards from './components/ListOfBoards'

import LogIn from './components/LogIn';


const setToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken))
}

const getToken = () => {

}

function App() {
    const token = getToken()

    if (!token) {
        return <LogIn setToken={setToken} />
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