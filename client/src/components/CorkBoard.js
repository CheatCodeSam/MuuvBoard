import React from "react"
import ScrollingStage from "./ScrollingStage"
import PinRequest from "./PinRequest"
import Toolbar from "./Toolbar"
import PinEditor from "./PinEditor"
import PinView from "./PinView"
import SearchResultsView from "./SearchResultsView"

const MAXSTAGESIZE = 10_000

class CorkBoard extends React.Component {
    constructor(props) {
        super(props)
        this.request = new PinRequest(props.data.id, this.props.token)
        this.state = {
            pins: props.data.pins.map(pin => this.createPinForBoard(pin)),
            showPinView: false,
            pinToView: 0,
            showPinEditor: false,
            PinEditorX: 0,
            PinEditorY: 0,
            showSearchResults: false,
            searchResults: [],
            boardWidth: 0,
            boardHeight: 0,
            boardX: 0,
            boardY: 0,
        }
    }

    // ===== LIFE CYCLE =====

    componentDidMount() {
        this.updateWindowDimensions()
        window.addEventListener("resize", this.updateWindowDimensions)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions)
    }

    // ===== UTIL =====

    getBoundedCoords = coords => {
        let newX = Math.max(coords.x, -MAXSTAGESIZE + this.state.boardWidth)
        newX = Math.min(newX, MAXSTAGESIZE)

        let newY = Math.max(coords.y, -MAXSTAGESIZE + this.state.boardHeight)
        newY = Math.min(newY, MAXSTAGESIZE)

        return { x: newX, y: newY }
    }

    createPinForBoard = pin => {
        return {
            ...pin,
            selected: false,
        }
    }

    mergePinsbyId = (entry, modified) => {
        return entry.map(obj => modified.find(o => o.id === obj.id) || obj)
    }

    getPinById = id => {
        return this.state.pins.find(pin => pin.id === id)
    }

    pushPinsToTop = ids => {
        const pinsToPush = this.state.pins.filter(pin => ids.includes(pin.id))
        const otherPins = this.state.pins.filter(pin => !ids.includes(pin.id))
        this.setState({ pins: [...otherPins, ...pinsToPush] })
    }

    // ===== BOARD MOVEMENT/SIZING =====

    updateWindowDimensions = () => {
        this.setState({
            boardWidth: window.innerWidth,
            boardHeight: window.innerHeight,
        })
    }

    move = coords => {
        this.setState({ boardX: coords.x, boardY: coords.y })
    }

    // ===== PROPS TO PASS =====

    onPinSelect = ids => {
        const _selectPinsById = state => {
            return state.pins.map(pin => {
                if (ids.includes(pin.id)) {
                    return { ...pin, selected: true }
                } else {
                    return { ...pin, selected: false }
                }
            })
        }
        this.pushPinsToTop(ids)
        this.setState(state => {
            return { pins: _selectPinsById(state) }
        })
    }

    onPinMoveEnd = pins => {
        this.request.onPinsMoveEnd(pins.map(id => this.getPinById(id)))
    }

    onPinDelete = pins => {
        this.setState({
            pins: this.state.pins.filter(pin => !!!pins.includes(pin.id)),
        })
        this.request.onPinsDelete(pins)
    }

    // TODO This is very jank, refactor so it doesnt need to use a callback,
    onPinCreate = pin => {
        this.request.onPinCreate(pin, this.makePin)
    }

    makePin = async data => {
        const pin = await data
        // TODO this is incredibly jank
        pin.data.images = pin.data.images.map(img => {
            return {
                ...img,
                image: `${process.env.REACT_APP_BASE_URL}${img.image}`,
            }
        })
        this.setState({
            pins: [...this.state.pins, this.createPinForBoard(pin.data)],
        })
    }

    onPinView = id =>
        this.setState({
            showSearchResults: false,
            showPinView: true,
            pinToView: id,
        })

    onPinMove = (coords, ids) => {
        const PinsToMove = ids.map(id => this.getPinById(id))
        const movedPins = PinsToMove.map(pin => {
            const newCoords = this.getBoundedCoords({
                x: pin.x_coordinate + coords.dx,
                y: pin.y_coordinate + coords.dy,
            })
            return {
                ...pin,
                x_coordinate: newCoords.x,
                y_coordinate: newCoords.y,
            }
        })
        this.setState({ pins: this.mergePinsbyId(this.state.pins, movedPins) })
    }

    onSearch = async query => {
        const results = await this.request.onSearch(query)
        this.setState({ searchResults: results.data, showSearchResults: true })
    }

    onGoToPin = pin => {
        this.onPinSelect([pin.id])
        this.move({ x: -pin.x_coordinate, y: -pin.y_coordinate })
    }

    onStagePan = coords => {
        this.move(this.getBoundedCoords(coords))
    }

    // ===== PIN EDITOR =====

    showPinEditor = coords =>
        this.setState({
            showPinEditor: true,
            PinEditorX: coords.x,
            PinEditorY: coords.y,
        })

    // Option ideas:
    // * Combine Pins
    // * Mass tag
    // * Reset size
    contextMenuOptions = _ => {
        const returnValue = []

        returnValue.push({
            name: "Create New Pin",
            func: this.showPinEditor,
        })

        if (this.state.pins.filter(p => p.selected).length !== 0) {
            returnValue.push({
                name: "Delete Pin",
                func: () => {
                    this.onPinDelete(
                        this.state.pins.filter(p => p.selected).map(p => p.id)
                    )
                },
            })
        }
        return returnValue
    }

    render() {
        return (
            <>
                <div className="stage-overlay">
                    <Toolbar
                        title={this.props.data.title}
                        onSearch={this.onSearch}
                    />
                    <div className="overlay">
                        <p className="coordinate-display">
                            {this.state.boardX}, {this.state.boardY}
                        </p>

                        {this.state.showPinEditor && (
                            <PinEditor
                                x={this.state.PinEditorX}
                                y={this.state.PinEditorY}
                                onEscape={() =>
                                    this.setState({ showPinEditor: false })
                                }
                                onPinCreate={this.onPinCreate}
                            />
                        )}

                        {this.state.showPinView && (
                            <PinView
                                pinId={this.state.pinToView}
                                onEscape={() =>
                                    this.setState({ showPinView: false })
                                }
                                onGoToPin={this.onGoToPin}
                            />
                        )}

                        {this.state.showSearchResults && (
                            <SearchResultsView
                                onEscape={() =>
                                    this.setState({ showSearchResults: false })
                                }
                                results={this.state.searchResults}
                                onPinView={this.onPinView}
                            />
                        )}
                    </div>
                </div>

                <ScrollingStage
                    pins={this.state.pins}
                    onPinSelect={this.onPinSelect}
                    onPinMove={this.onPinMove}
                    onPinMoveEnd={this.onPinMoveEnd}
                    onPinDblClick={this.onPinView}
                    onStagePan={this.onStagePan}
                    height={this.state.boardHeight}
                    width={this.state.boardWidth}
                    contextMenuOptions={this.contextMenuOptions()}
                    x={this.state.boardX}
                    y={this.state.boardY}
                />
            </>
        )
    }
}

export default CorkBoard
