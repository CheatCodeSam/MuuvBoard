import axios from 'axios';
import React from 'react';
import ScrollingStage from './ScrollingStage'


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

        // const modifiedPins = {
        //     pins: [
        //         {
        //             id: e.target.id(),
        //             action: "move",
        //             movement: { x: e.target.x(), y: e.target.y() },
        //         },
        //     ]
        // };
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



    render() {
        return (<>
            <ScrollingStage
                pins={this.props.data.pins}
                onPinMove={this.onPinMove}
                onPinCreate={() => { }}
                onPinDelete={this.onPinDelete}
            />
            {/* < CreatePin onSubmit={this.handleCreation} /> */}
        </>)

    }



}

export default CorkBoard;