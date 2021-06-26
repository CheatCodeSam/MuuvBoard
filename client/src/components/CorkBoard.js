import axios from 'axios';
import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinEditor from './PinEditor';
import PinRequest from './PinRequest'


class CorkBoard extends React.Component {

    constructor(props) {
        super(props)
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${props.data.id}/pins/`
        this.request = new PinRequest(props.data.id);
    }

    getIds = (pins) => {
        return pins.map(pin => { return pin.id })
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
        this.request.onPinsDelete(this.getIds(pins))
    }

    onPinCreate = (pin) => {
        this.request.onPinCreate(pin)
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