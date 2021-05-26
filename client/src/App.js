import './App.css';
import {
    Switch,
    Route,
} from "react-router-dom";

import BoardLoader from './components/BoardLoader';


const url = `${process.env.REACT_APP_BASE_URL}/api/boards/1/pins/`


function App() {

    return (
        <>
            <Switch>
                <Route path="/board/:BoardId/" component={BoardLoader}>
                </Route>
                <Route path="/">
                </Route>
            </Switch>
        </>
    );
}



export default App;