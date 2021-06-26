import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinRequest from './PinRequest'


class CorkBoard extends React.Component {

    constructor(props) {
        super(props)
        this.request = new PinRequest(props.data.id);
        this.state = {
            pins: props.data.pins.map(pin => this.createPinForBoard(pin))
        }
    }

    createPinForBoard = (pin) => {
        return {
            ...pin,
            selected: false
        }
    }

    getIds = (pins) => {
        return pins.map(pin => { return pin.id })
    }

    onPinMove = (pins) => {

    }

    onPinMoveEnd = (pins) => {
        console.log(this.state.pins)

        this.request.onPinsMoveEnd(pins)
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
                    onPinMove={this.onPinMoveEnd}
                    onPinCreate={this.onPinCreate}
                    onPinDelete={this.onPinDelete}
                />
            </>
        )

    }

}

export default CorkBoard;