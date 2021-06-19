import React from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import Konva from "konva";
import ContextMenu from './ContextMenu';
import ImagePin from './ImagePin'
import PinEditor from './PinEditor';




const selectionState = {
    selection: {
        visible: false,
        x1: null,
        y1: null,
        x2: null,
        y2: null
    }
}
const contextMenuState = {
    contextMenu: {
        visible: false,
        x: null,
        y: null
    }
}
const panningState = {
    grab: false,
}
const windowSizeState = {
    width: 0, height: 0
}

const stageStyles = {
    backgroundColor: "#e5e5f7",
    opacity: 0.8,
    backgroundImage: "radial-gradient(#444cf7 1.1px, #e5e5f7 1.1px)",
    backgroundSize: "22px 22px",

}



const MOUSEONE = 0;
const MOUSETWO = 2;
const MOUSETHREE = 1;

class ScrollingStage extends React.Component {

    constructor(props) {
        super(props);
        this.stage = React.createRef()
        this.state = {
            pins: props.pins.map(pin => { return { ...pin, selected: false } }),
            stageOffset: {
                x: 0,
                y: 0
            },
            showPinEditor: false,
            ...selectionState,
            ...contextMenuState,
            ...panningState,
            ...windowSizeState
        }
    }
    // ===== LIFE CYCLE =====

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    // ===== UTIL =====

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    calculateStageOffset = (coords) => {
        return { x: coords.x - this.state.stageOffset.x, y: coords.y - this.state.stageOffset.y };
    }

    deselectAllPins = () => {
        this.setState({
            pins: this.state.pins.map(pin => { return { ...pin, selected: false } })
        })
    }

    getSelectedPins = () => {
        return this.state.pins.filter(pin => pin.selected);
    }

    mergePinsbyId = (entry, modified) => {
        return entry.map((obj) => modified.find((o) => o.id === obj.id) || obj);
    }

    getPinById = (id) => {
        return this.state.pins.find(pin => pin.id === id);
    };

    selectPinsById = (ids) => {
        const _selectPinsById = (state) => {
            return state.pins.map(pin => {
                if (ids.includes(pin.id)) {
                    return { ...pin, selected: true }
                } else {
                    return pin;
                }
            })
        }
        this.pushPinsToTop(ids)
        this.setState(state => {
            return { pins: _selectPinsById(state) }
        })
    }

    calculateSelectionBox = () => {
        return {
            x: Math.min(this.state.selection.x1, this.state.selection.x2),
            y: Math.min(this.state.selection.y1, this.state.selection.y2),
            height: Math.abs(this.state.selection.y2 - this.state.selection.y1),
            width: Math.abs(this.state.selection.x2 - this.state.selection.x1)
        };
    }

    hideContextMenu = () => {
        this.setState((state) => {
            return { contextMenu: { ...state.contextMenu, visible: false } };
        });
    };

    deleteSelectedPins = () => {
        this.hideContextMenu();
        const pinsToDelete = this.getSelectedPins()
        this.setState({ pins: this.state.pins.filter(pin => !!!pin.selected) })
        this.props.onPinDelete(pinsToDelete)
    }

    hideSelectionBox = () => {
        this.setState({ selection: { ...this.state.selection, visible: false } })
    }

    moveSelectedPins = (coords) => {
        const selectedPins = this.getSelectedPins()
        const movedPins = selectedPins.map(pin => { return { ...pin, x_coordinate: pin.x_coordinate + coords.x, y_coordinate: pin.y_coordinate + coords.y } })
        this.setState({ pins: this.mergePinsbyId(this.state.pins, movedPins) })
    }

    pushPinsToTop = (ids) => {
        const pinsToPush = this.state.pins.filter(pin => ids.includes(pin.id))
        const otherPins = this.state.pins.filter(pin => !ids.includes(pin.id))
        this.setState({ pins: [...otherPins, ...pinsToPush] })
    }

    // ===== STAGE EVENTS =====

    onMouseDownOnStage = (e) => {
        const stage = this.stage.current;
        const { target } = e;


        this.hideContextMenu()

        if (e.evt.button === MOUSEONE) {
            if (target === stage) {
                this.deselectAllPins()
                const { x, y } = this.calculateStageOffset(stage.getPointerPosition())
                this.setState(state => {
                    return {
                        selection: {
                            ...state.selection,
                            visible: true,
                            x1: x,
                            y1: y,
                            x2: x,
                            y2: y
                        }
                    }
                })
            } else if (target.parent.name() === "pin") {
                const pin = this.getPinById(target.parent.id())
                console.log(pin)
                if (!!!pin.selected) {
                    this.deselectAllPins()
                    this.selectPinsById([pin.id])
                }
            }
        }

        if (e.evt.button === MOUSETHREE) {
            e.evt.preventDefault();
            this.hideSelectionBox()
            this.setState({ grab: true });
        }
    }

    onMouseUp = (e) => {
        const stage = this.stage.current;

        if (this.state.selection.visible) {
            this.hideSelectionBox()
            this.deselectAllPins()
            const selectionBox = this.calculateSelectionBox()
            const pinShapes = stage.find('.pin')
            // TODO fix this ugly line
            const selected = pinShapes.filter(pin => Konva.Util.haveIntersection(selectionBox, { x: pin.x(), y: pin.y(), width: pin.width(), height: pin.height() }))
            this.selectPinsById(selected.map((a) => a.id()))
        }

        if (this.state.grab) {
            this.setState({ grab: false });
        }
    }

    onMouseMove = (e) => {
        const stage = this.stage.current;
        if (this.state.selection.visible) {
            const { x, y } = this.calculateStageOffset(stage.getPointerPosition())
            this.setState(
                {
                    selection: {
                        ...this.state.selection,
                        x2: x,
                        y2: y
                    }
                }
            )
        }
    }

    onStageDrag = (e) => {
        if (this.state.grab) {
            const { target } = e
            this.setState({
                stageOffset: {
                    x: target.x(),
                    y: target.y()
                }
            })
        }
    }

    // ===== PIN EVENTS =====

    onPinDragStart = (e) => {
        const { target } = e;
        const pin = this.getPinById(target.id());

        if (!!!pin.selected) {
            this.deselectAllPins()
            this.selectPinsById([pin.id])
        }
    }

    onPinDrag = (e) => {
        const { target } = e;
        const pin = this.getPinById(target.id())
        const movement = {
            x: target.x() - pin.x_coordinate,
            y: target.y() - pin.y_coordinate
        };

        this.moveSelectedPins(movement)

    }

    onPinDragEnd = (e) => {
        this.props.onPinMove(this.getSelectedPins())
    }

    // ===== CONTEXT MENU =====

    onContextMenu = (e) => {
        const stage = this.stage.current;
        const { target } = e;

        e.evt.preventDefault()
        this.hideSelectionBox()
        const { x, y } = this.calculateStageOffset(stage.getPointerPosition())
        this.setState(
            {
                contextMenu: {
                    ...this.state.contextMenu,
                    x: x,
                    y: y,
                    visible: true
                }
            }
        )
        if (target === stage) {
            this.deselectAllPins()
        } else if (target.parent.name() === "pin") {
            const pin = this.getPinById(target.parent.id())
            if (!!!pin.selected) {
                this.deselectAllPins()
                this.selectPinsById([pin.id])
            }
        }
    }

    generateContextMenuOptions = () => {
        let returnValue = [{ name: 'Create Pin', func: () => { this.showPinEditor(); this.hideContextMenu(); } }]
        if (!!this.getSelectedPins().length) {
            returnValue.push({ name: "Delete Pin", func: this.deleteSelectedPins })
        }
        return returnValue
    }

    // ===== PIN EDITOR =====

    showPinEditor = () => {
        this.setState({ showPinEditor: true })

    }

    onPinEditorEscape = (e) => {
        this.setState({ showPinEditor: false })
    }

    onPinCreate = (pin) => {
        this.props.onPinCreate(pin)
    }


    render() {
        const offsetStyle = {
            ...stageStyles,
            backgroundPosition:
                this.state.stageOffset.x + "px " + this.state.stageOffset.y + "px"
        }
        const selc = this.calculateSelectionBox()

        return (
            <div
                tabIndex='0'
                className={this.state.grab ? "grabbing" : ""}
            >
                {this.state.showPinEditor &&
                    <PinEditor
                        x={this.state.contextMenu.x}
                        y={this.state.contextMenu.y}
                        onEscape={() => this.setState({ showPinEditor: false })}
                        onPinCreate={this.onPinCreate}
                    />
                }


                <Stage
                    height={this.state.height}
                    width={this.state.width}
                    style={offsetStyle}
                    ref={this.stage}
                    onContextMenu={this.onContextMenu}
                    onMouseDown={this.onMouseDownOnStage}
                    onMouseMove={this.onMouseMove}
                    onMouseUp={this.onMouseUp}
                    draggable={this.state.grab}
                    onDragMove={this.onStageDrag}
                >
                    <Layer>
                        {
                            this.state.pins.map((pin) => {
                                return <ImagePin
                                    key={pin.id}
                                    id={pin.id}
                                    name="pin"
                                    x={pin.x_coordinate}
                                    y={pin.y_coordinate}
                                    title={pin.title}
                                    thumbnail={pin.image}
                                    draggable={!this.state.grab}
                                    selected={pin.selected}
                                    onDragStart={this.onPinDragStart}
                                    onDragMove={this.onPinDrag}
                                    onDragEnd={this.onPinDragEnd}
                                />
                            })
                        }

                        {this.state.selection.visible && (
                            <Rect
                                name="selection"
                                x={selc.x}
                                y={selc.y}
                                height={selc.height}
                                width={selc.width}
                                fill="teal"
                                opacity={0.8}
                                strokeWidth={1}
                                stroke="blue"
                            />
                        )}
                        {this.state.contextMenu.visible && (
                            <ContextMenu
                                x={this.state.contextMenu.x}
                                y={this.state.contextMenu.y}
                                options={this.generateContextMenuOptions()}
                            />
                        )}
                    </Layer>
                </Stage>



            </div>
        )


    }

}


export default ScrollingStage;