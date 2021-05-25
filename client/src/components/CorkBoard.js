import axios from 'axios';
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import ImagePin from './ImagePin'
import CreatePin from './CreatePin'



function CorkBoard(props) {


    const [pins, setPins] = useState(props.data.pins)


    const stageStyles = {
        backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
        backgroundSize: "10px 10px",
        backgroundColor: "#e5e5f7",
        opacity: "0.8"
    };

    const onDragEnd = async (e) => {
        const url = process.env.REACT_APP_BASE_URL + "/api/boards/1/pins/"
        const modifiedPins = {
            pins: [
                {
                    id: e.target.id(),
                    action: "move",
                    movement: { x: e.target.x(), y: e.target.y() },
                },
            ]
        };
        await axios.patch(url, modifiedPins);
    }

    const onDelete = async (id) => {
        const url = process.env.REACT_APP_BASE_URL + "/api/boards/1/pins/"
        const modifiedPins = {
            pins: [
                {
                    id: id,
                    action: "delete",
                },
            ]
        }

        await axios.patch(url, modifiedPins)
        const filtedList = pins.filter(pin => pin.id !== id);
        setPins(filtedList)
    }

    return (
        <>
            <Stage width={1000} height={1000} style={stageStyles}  >
                <Layer>
                    {pins.map((pin) => (
                        <ImagePin key={pin.id} id={pin.id} x={pin.x_coordinate} y={pin.y_coordinate} title={pin.title} imageUrl={`${process.env.REACT_APP_BASE_URL}${pin.image}`} onDragEnd={onDragEnd}
                            onDelete={onDelete} />
                    ))}
                </Layer>
            </ Stage >
            < CreatePin onSubmit={(pin) => {
                const newList = pins.concat(pin);
                setPins(newList)
            }} />
        </>
    )
}

export default CorkBoard;