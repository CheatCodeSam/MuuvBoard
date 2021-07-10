import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinRequest from './PinRequest'
import { v4 as uuidv4 } from 'uuid'
import Toolbar from './Toolbar'
import PinEditor from './PinEditor';
import { MainContext } from '../context/MainContext';






class CorkBoard extends React.Component {


    constructor(props) {
        super(props)
        this.request = new PinRequest(props.data.id, this.props.token);
        this.state = {
            pins: props.data.pins.map(pin => this.createPinForBoard(pin)),
            showPinEditor: false,
            PinEditorX: 0, PinEditorY: 0,
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
        this.setState({ pins: this.state.pins.filter(pin => !!!pins.includes(pin.id)) })

        this.request.onPinsDelete(pins)
    }

    onPinCreate = (pin) => {
        console.log(pin)
        // console.log(pin.image[0])

        // this.request.onFileCreate(pin.image[0])

        // const newPinId = uuidv4()
        // const newPin =
        // {
        //     id: newPinId,
        //     title: pin.title,
        //     image: URL.createObjectURL(pin.image),
        //     x_coordinate: pin.x_coordinate,
        //     y_coordinate: pin.y_coordinate,
        //     selected: false
        // }
        // this.setState({
        //     pins: [...this.state.pins, newPin],
        // })
        // this.onPinSelect([newPinId])

        this.request.onPinCreate(pin)
    }

    onPinMove = (coords, ids) => {
        const PinsToMove = ids.map(id => this.getPinById(id))
        const movedPins = PinsToMove.map(pin => { return { ...pin, x_coordinate: pin.x_coordinate + coords.x, y_coordinate: pin.y_coordinate + coords.y } })
        this.setState({ pins: this.mergePinsbyId(this.state.pins, movedPins) })
    }


    // ===== PIN EDITOR =====

    showPinEditor = (x, y) => this.setState({ showPinEditor: true, PinEditorX: x, PinEditorY: y })

    render() {
        return (
            <>
                <Toolbar title={this.props.data.title} />

                {this.state.showPinEditor &&
                    <PinEditor
                        x={this.state.PinEditorX}
                        y={this.state.PinEditorY}
                        onEscape={() => this.setState({ showPinEditor: false })}
                        onPinCreate={this.onPinCreate}
                    />
                }

                <ScrollingStage
                    pins={this.state.pins}
                    onPinSelect={this.onPinSelect}
                    onPinMove={this.onPinMove}
                    onPinMoveEnd={this.onPinMoveEnd}
                    onPinCreate={this.onPinCreate}
                    onPinDelete={this.onPinDelete}
                    showPinEditor={this.showPinEditor}
                    onPinEditorEscape={this.showPinEditor}
                />
            </>
        )

    }

}

export default CorkBoard;