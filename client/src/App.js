import './App.css';
import Board from './components/Board'
import OpenBoard from './components/OpenBoard'
import { useState, useEffect, setAppState } from 'react'
import axios from 'axios'


const url = `${process.env.REACT_APP_BASE_URL}/api/boards/1/pins/`


function App() {

    const [appState, setAppState] = useState({
        loading: false,
        pins: null,
    });

    useEffect(() => {
        setAppState({ loading: true });
        axios.get(url).then((response) => {
            const collectedPins = response.data;
            setAppState({ loading: false, pins: collectedPins });
        });
    }, [setAppState]);

    return (
        <div>
            {appState.pins && <OpenBoard data={appState.pins} />}
        </div>
    );
}

export default App;
