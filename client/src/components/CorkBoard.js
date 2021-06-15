import axios from 'axios';
import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinEditor from './PinEditor';


class CorkBoard extends React.Component {

    constructor(props) {
        super(props)
        this.url = `${process.env.REACT_APP_BASE_URL}/api/boards/${props.data.id}/pins/`
        this.state = { showPinEditor: false }
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

    onEscape = (e) => {
        this.setState({ showPinEditor: false })
    }


    render() {
        return (
            <>

                {this.state.showPinEditor &&
                    <PinEditor
                        onEscape={() => this.setState({ showPinEditor: false })}
                    />
                }

                <ScrollingStage
                    pins={this.props.data.pins}
                    onPinMove={this.onPinMove}
                    onPinCreate={() => this.setState({ showPinEditor: true })}
                    onPinDelete={this.onPinDelete}
                />



            </>
        )

    }



}

export default CorkBoard;