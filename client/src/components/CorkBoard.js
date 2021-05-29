import axios from 'axios';
import React, { useState } from 'react';
import { Stage, Layer } from 'react-konva';
import ImagePin from './ImagePin'
import CreatePin from './CreatePin'
import ScrollingStage from './ScrollingStage'


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
        return (<>
            <ScrollingStage >
                <Layer>
                    {this.state.pins.map((pin) => (
                        <ImagePin key={pin.id} data={pin} onDragEnd={this.onDragEnd} onDelete={this.onDelete} />
                    ))}
                </Layer>
            </ ScrollingStage >
            {/* < CreatePin onSubmit={this.handleCreation} /> */}
        </>)

    }



}

export default CorkBoard;