import React from 'react';
import { Stage, Layer, Rect, Text, Image, Line, Group } from 'react-konva';
import ImagePin from './ImagePin'



function Board(props) {


    const pins = props.data.pins

    const stageStyles = {
        backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
        backgroundSize: "10px 10px",
        backgroundColor: "#e5e5f7",
        opacity: "0.8"
    };

    const onDragEnd = (e) => {
        const modifiedPins = {
            pins: [
                {
                    id: e.target.id(),
                    action: "move",
                    movement: { x: e.target.x(), y: e.target.y() },
                },
            ]
        };
        console.log(modifiedPins)
    }

    return (
        <Stage width={1000} height={1000} style={stageStyles}  >
            <Layer>
                {pins.map((pin) => (
                    <ImagePin id={pin.id} x={pin.x_coordinate} y={pin.y_coordinate} title={pin.title} imageUrl={pin.image} onDragEnd={onDragEnd} />
                ))}
            </Layer>
        </ Stage >
    )
}

export default Board;