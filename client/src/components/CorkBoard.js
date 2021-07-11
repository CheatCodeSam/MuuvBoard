import React from 'react';
import ScrollingStage from './ScrollingStage'
import PinRequest from './PinRequest'
import Toolbar from './Toolbar'
import PinEditor from './PinEditor';
import PinView from './PinView'
import SearchResultsView from './SearchResultsView';






class CorkBoard extends React.Component {


    constructor(props) {
        super(props)
        this.request = new PinRequest(props.data.id, this.props.token);
        this.state = {
            pins: props.data.pins.map(pin => this.createPinForBoard(pin)),
            showPinView: false,
            pinToView: 0,
            showPinEditor: false,
            PinEditorX: 0, PinEditorY: 0,
            showSearchResults: false,
            searchResuts: []
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

    // TODO This is very jank, refactor so it doesnt need to use a callback,
    onPinCreate = (pin) => {
        this.request.onPinCreate(pin, this.makePin)
    }

    makePin = async (data) => {
        const pin = await data
        // TODO this is incredibly jank
        pin.data.images = pin.data.images.map(img => { return { ...img, image: `${process.env.REACT_APP_BASE_URL}${img.image}` } })
        this.setState({
            pins: [...this.state.pins, this.createPinForBoard(pin.data)],
        })
    }

    onPinView = (id) => this.setState({ showSearchResults: false, showPinView: true, pinToView: id })

    onPinMove = (coords, ids) => {
        const PinsToMove = ids.map(id => this.getPinById(id))
        const movedPins = PinsToMove.map(pin => { return { ...pin, x_coordinate: pin.x_coordinate + coords.x, y_coordinate: pin.y_coordinate + coords.y } })
        this.setState({ pins: this.mergePinsbyId(this.state.pins, movedPins) })
    }

    onSearch = async (query) => {
        const results = await this.request.onSearch(query)
        this.setState({ searchResuts: results.data, showSearchResults: true })
    }


    // ===== PIN EDITOR =====

    showPinEditor = (x, y) => this.setState({ showPinEditor: true, PinEditorX: x, PinEditorY: y })

    render() {
        return (
            <>
                <Toolbar title={this.props.data.title} onSearch={this.onSearch} />

                {this.state.showPinEditor &&
                    <PinEditor
                        x={this.state.PinEditorX}
                        y={this.state.PinEditorY}
                        onEscape={() => this.setState({ showPinEditor: false })}
                        onPinCreate={this.onPinCreate}
                    />
                }

                {this.state.showPinView &&
                    <PinView
                        data={this.getPinById(this.state.pinToView)}
                        onEscape={() => this.setState({ showPinView: false })}
                    />
                }

                {this.state.showSearchResults &&
                    <SearchResultsView
                        onEscape={() => this.setState({ showSearchResults: false })}
                        results={this.state.searchResuts}
                        onPinView={this.onPinView}
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
                    onPinView={this.onPinView}
                />
            </>
        )

    }

}

export default CorkBoard;