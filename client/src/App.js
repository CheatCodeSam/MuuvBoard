import logo from './logo.svg';
import './App.css';
import Board from './components/Board'


const mockData = JSON.parse(
    `{
        "pins": [
            {
                "id": 1,
                "title": "Test Pin One",
                "image": "https://picsum.photos/id/1024/300/300",
                "x_coordinate": 100,
                "y_coordinate": 100,
                "created": "2021-05-17T01:58:06.653174Z",
                "updated": "2021-05-17T23:27:18.814219Z",
                "board": {
                    "id": 1,
                    "title": "Board 1",
                    "created": "2021-05-17T20:13:34.079467Z",
                    "updated": "2021-05-17T20:12:53.509582Z"
                }
            },
            {
                "id": 2,
                "title": "Test Pin Two",
                "image": "https://picsum.photos/id/1018/300/300",
                "x_coordinate": 50,
                "y_coordinate": 32,
                "created": "2021-05-17T23:24:16.869477Z",
                "updated": "2021-05-17T23:27:21.281770Z",
                "board": {
                    "id": 1,
                    "title": "Board 1",
                    "created": "2021-05-17T20:13:34.079467Z",
                    "updated": "2021-05-17T20:12:53.509582Z"
                }
            }
        ],
        "title": "Board 1",
        "id": 1
    }`
)


function App() {
    return (
        <div>
            <Board data={mockData} />
        </div>
    );
}

export default App;
