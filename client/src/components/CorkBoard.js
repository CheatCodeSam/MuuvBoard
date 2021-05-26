import axios from 'axios';
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import ImagePin from './ImagePin'
import CreatePin from './CreatePin'



function CorkBoard(props) {

    const BoardId = props.data.id
    const url = process.env.REACT_APP_BASE_URL + `/api/boards/${BoardId}/pins/`

    const [pins, setPins] = useState(props.data.pins)


    const stageStyles = {
        backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
        backgroundSize: "10px 10px",
        backgroundColor: "#e5e5f7",
        opacity: "0.8"
    };

    const onDragEnd = async (e) => {
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

    const handleCreation = (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('image', values.file);
        formData.append('board', BoardId);
        try {
            axios.post(url, formData).then((data) => {
                const pin = data.data
                const newList = pins.concat(pin);
                setPins(newList)

            });
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }

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
            < CreatePin onSubmit={handleCreation} />
        </>
    )
}

export default CorkBoard;