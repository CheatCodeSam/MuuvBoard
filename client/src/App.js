import './App.css';
import { Switch, Route } from "react-router-dom";

import Board from './components/Board';

import ListOfBoards from './components/ListOfBoards'




function App() {

    return (
        <>
            <Switch>
                <Route path="/board/:BoardId/" component={Board} />
                <Route path="/" component={ListOfBoards} />
            </Switch>
        </>
    );
}



export default App;