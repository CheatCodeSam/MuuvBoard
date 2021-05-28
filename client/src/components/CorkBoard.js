import axios from 'axios';
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import ImagePin from './ImagePin'
import CreatePin from './CreatePin'



class CorkBoard extends React.Component {

    constructor(props) {
        super(props)
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${props.data.id}/pins/`

        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.handleCreation = this.handleCreation.bind(this);

        this.state = {
            pins: props.data.pins
        };
    }

    onDragEnd(e) {
        const modifiedPins = {
            pins: [
                {
                    id: e.target.id(),
                    action: "move",
                    movement: { x: e.target.x(), y: e.target.y() },
                },
            ]
        };
        axios.patch(this.url, modifiedPins);
    }

    onDelete(id) {
        console.log(id)
        const modifiedPins = {
            pins: [
                {
                    id: id,
                    action: "delete",
                },
            ]
        }

        axios.patch(this.url, modifiedPins)
        const filtedList = this.state.pins.filter(pin => pin.id !== id);
        this.setState({ pins: filtedList })
    }

    handleCreation(values) {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('image', values.file);
        formData.append('board', this.props.data.id);
        try {
            axios.post(this.url, formData).then((data) => {
                const pin = data.data
                const newList = this.state.pins.concat(pin);
                this.setState({ pins: newList })

            });
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }

    }

    render() {
        const stageStyles = {
            backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
            backgroundSize: "10px 10px",
            backgroundColor: "#e5e5f7",
            opacity: "0.8"
        };


        return (<>
            <Stage width={1000} height={1000} style={stageStyles}  >
                <Layer>
                    {this.state.pins.map((pin) => (
                        <ImagePin key={pin.id} id={pin.id} x={pin.x_coordinate} y={pin.y_coordinate} title={pin.title} imageUrl={`${process.env.REACT_APP_BASE_URL}${pin.image}`} onDragEnd={this.onDragEnd}
                            onDelete={this.onDelete} />
                    ))}
                </Layer>
            </ Stage >
            < CreatePin onSubmit={this.handleCreation} />
        </>)

    }



}

export default CorkBoard;