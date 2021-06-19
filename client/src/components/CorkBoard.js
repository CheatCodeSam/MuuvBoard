import axios from 'axios';
import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinEditor from './PinEditor';


class CorkBoard extends React.Component {

    constructor(props) {
        super(props)
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${props.data.id}/pins/`
    }

    onPinMove = (pins) => {
        const modifiedPins = {
            pins: pins.map(pin => {
                return {
                    id: pin.id,
                    action: "move",
                    movement: { x: pin.x_coordinate, y: pin.y_coordinate }
                }
            })
        }
        axios.patch(this.url, modifiedPins);
    }

    onPinDelete = (pins) => {
        const modifiedPins = {
            pins: pins.map(pin => {
                return {
                    id: pin.id,
                    action: "delete",
                }
            })
        }
        axios.patch(this.url, modifiedPins)
    }

    onPinCreate = (pin) => {
        const formData = new FormData();
        formData.append('title', pin.title);
        formData.append('image', pin.image);
        formData.append('x_coordinate', pin.x_coordinate);
        formData.append('y_coordinate', pin.y_coordinate);
        formData.append('board', this.props.data.id);
        try {
            axios.post(this.url, formData)
        } catch (response) {
            const data = response.response.data;
            console.log(data)
        }
    }



    render() {
        return (
            <>



                <ScrollingStage
                    pins={this.props.data.pins}
                    onPinMove={this.onPinMove}
                    onPinCreate={this.onPinCreate}
                    onPinDelete={this.onPinDelete}
                />



            </>
        )

    }



}

export default CorkBoard;