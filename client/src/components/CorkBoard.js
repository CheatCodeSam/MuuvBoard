import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinRequest from './PinRequest'
import { v4 as uuidv4 } from 'uuid'



class CorkBoard extends React.Component {

    constructor(props) {
        super(props)
        this.request = new PinRequest(props.data.id);
        this.state = {
            pins: props.data.pins.map(pin => this.createPinForBoard(pin))
        }
    }

    // ===== UTIL =====
    createPinForBoard = (pin) => {
        return {
            ...pin,
            selected: false
        }
    }

    getIds = (pins) => {
        return pins.map(pin => { return pin.id })
    }

    mergePinsbyId = (entry, modified) => {
        return entry.map((obj) => modified.find((o) => o.id === obj.id) || obj);
    }

    getPinById = (id) => {
        return this.state.pins.find(pin => pin.id === id);
    };

    pushPinsToTop = (ids) => {
        const pinsToPush = this.state.pins.filter(pin => ids.includes(pin.id))
        const otherPins = this.state.pins.filter(pin => !ids.includes(pin.id))
        this.setState({ pins: [...otherPins, ...pinsToPush] })
    }

    // ===== PROPS TO PASS =====

    onPinSelect = (ids) => {
        const _selectPinsById = (state) => {
            return state.pins.map(pin => {
                if (ids.includes(pin.id)) {
                    return { ...pin, selected: true }
                } else {
                    return { ...pin, selected: false };
                }
            })
        }
        this.pushPinsToTop(ids)
        this.setState(state => {
            return { pins: _selectPinsById(state) }
        })

    }

    onPinMoveEnd = (pins) => {
        this.request.onPinsMoveEnd(pins)
    }

    onPinDelete = (pins) => {
        const ids = this.getIds(pins)
        const PinsToDelete = ids.map(id => this.getPinById(id))
        this.setState({ pins: this.state.pins.filter(pin => !!!ids.includes(pin.id)) })

        this.request.onPinsDelete(PinsToDelete)
    }

    onPinCreate = (pin) => {

        const newPinId = uuidv4()
        const newPin =
        {
            id: newPinId,
            title: pin.title,
            image: URL.createObjectURL(pin.image),
            x_coordinate: pin.x_coordinate,
            y_coordinate: pin.y_coordinate,
            selected: false
        }
        this.setState({
            pins: [...this.state.pins, newPin],
        })
        this.selectPins([newPinId])

        this.request.onPinCreate(pin)
    }

    onPinMove = (coords, ids) => {
        const PinsToMove = ids.map(id => this.getPinById(id))
        const movedPins = PinsToMove.map(pin => { return { ...pin, x_coordinate: pin.x_coordinate + coords.x, y_coordinate: pin.y_coordinate + coords.y } })
        this.setState({ pins: this.mergePinsbyId(this.state.pins, movedPins) })
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