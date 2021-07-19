import React from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import Konva from "konva";
import ContextMenu from './ContextMenu';
import ImagePin from './ImagePin'
import SelectionBoxEvents from './SelectionBoxEvents';
import ContextMenuEvents from './ContextMenuEvents';


const MOUSEONE = 0;
const MOUSETWO = 2;
const MOUSETHREE = 1;

const SCROLLINGSPEED = 34;

//! REACT WAS NOT MADE TO SUPPORT CANVAS
// All rules involving how React should operate
// should be taken with a grain of salt. We are 
// not working with a DOM, we are working 
// with a canvas.
class ScrollingStage extends React.Component {

    constructor(props) {
        super(props);
        this.setState = this.setState.bind(this);
        this.stage = React.createRef()

        this.selectionBox = new SelectionBoxEvents(this.setState);
        this.contextMenu = new ContextMenuEvents(this.setState);
        this.state = {
            grab: false,
            dragging: false,
            leftSideOfScreen: false,
            intervalId: undefined,
            ...this.selectionBox.getState(),
            ...this.contextMenu.getState(),
        }
    }


    move = (x, y) => {
        this.props.onStagePan({ x: x, y: y })
    }

    scrollStageIfNessecary = (mousePos) => {
        if (mousePos.x < 15) {
            this.moveLeft()
        } else {
            this.stopMoveLeft()
        }
    }

    moveLeft = () => {
        this.setState({ leftSideOfScreen: true })
        if (!this.state.intervalId) {
            console.log("Setting Interval")
            const intervalId = setInterval(() => {
                this.move(this.props.x + SCROLLINGSPEED, this.props.y)
            }, 1000 / 30)
            this.setState({ intervalId: intervalId })

        }
    }
    stopMoveLeft = () => {
        this.setState({ leftSideOfScreen: false })
        clearInterval(this.state.intervalId)
        this.setState({ intervalId: undefined })
    }



    // ===== LIFE CYCLE =====

    componentDidMount() {

        window.addEventListener('mouseup', this.onMouseUpWindow)
        window.addEventListener('mousemove', this.onMouseMoveWindow)
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.onMouseUpWindow);
        window.removeEventListener('mousemove', this.onMouseMoveWindow)
    }

    // ===== UTIL =====

    calculateStageOffset = (coords) => {
        return { x: coords.x - this.props.x, y: coords.y - this.props.y };
    }

    getSelectedPins = () => this.props.pins.filter(pin => pin.selected);

    getSelectedPinsIds = () => this.props.pins.filter(pin => pin.selected).map(pin => pin.id)

    getPinById = (id) => this.props.pins.find(pin => pin.id === id);

    getCenterPointOfPins = (ids) => {

        const pinCoords = ids.map(id => {
            const pin = this.getPinById(id)
            return { x: pin.x_coordinate, y: pin.y_coordinate, width: 135, height: 160 }
        })
        if (pinCoords.length == 0) {
            return null
        }
        const x1 = Math.min(...pinCoords.map(pin => pin.x))
        const x2 = Math.max(...pinCoords.map(pin => pin.x + pin.width))

        const y1 = Math.min(...pinCoords.map(pin => pin.y))
        const y2 = Math.max(...pinCoords.map(pin => pin.y + pin.height))

        const midPointX = (x1 + x2) / 2
        const midPointY = (y1 + y2) / 2

        return { x: midPointX, y: midPointY }

    }


    // ===== PROPS REQUEST =====

    selectPins = (ids) => this.props.onPinSelect(ids)

    moveSelectedPins = (coords) => this.props.onPinMove(coords, this.getSelectedPinsIds())

    deleteSelectedPins = () => this.props.onPinDelete(this.getSelectedPinsIds())

    onPinCreate = (pin) => this.props.onPinCreate(pin)

    onPinMoveEnd = () => this.props.onPinMoveEnd(this.getSelectedPins())

    // ===== STAGE/WINDOW EVENTS =====

    onMouseDownOnStage = (e) => {
        const stage = this.stage.current;
        const { target } = e;

        this.contextMenu.hideContextMenu()

        if (e.evt.button === MOUSEONE) {
            if (target === stage) {
                this.selectPins([])
                const coords = this.calculateStageOffset(stage.getPointerPosition())
                this.selectionBox.selectionBoxCreate(coords)
            } else if (target.parent.name() === "pin") {
                const pin = this.getPinById(target.parent.id())
                if (!!!pin.selected) {
                    this.selectPins([pin.id])
                }
            }
        }

        if (e.evt.button === MOUSETHREE) {
            e.evt.preventDefault();
            this.selectionBox.hideSelectionBox()
            this.setState({ grab: true });
        }
    }

    onMouseUpWindow = (e) => {
        const stage = this.stage.current;
        this.stopMoveLeft()

        if (this.selectionBox.isVisible(this.state)) {
            const pinShapes = stage.find('.pin')
            const selectedPins = this.selectionBox.selectionBoxEnd(this.state, pinShapes)
            this.selectPins(selectedPins.map((a) => a.id()))
        }

        if (this.state.grab) {
            this.setState({ grab: false });
        }
    }

    onMouseMoveWindow = (e) => {
        const stage = this.stage.current;
        if (this.selectionBox.isVisible(this.state)) {
            // * Because were using mouseMoveWindow we have to account for the 48 px height of the toolbar
            const stagePosition = stage.content.getBoundingClientRect()
            const coords = this.calculateStageOffset({ x: e.clientX - stagePosition.x, y: e.clientY - stagePosition.y })
            this.selectionBox.selectionBoxMove(coords)
        }
    }

    onStageDrag = (e) => {
        if (this.state.grab) {
            const { target } = e
            this.move(target.x(), target.y())
        }
    }

    // ===== PIN EVENTS =====

    onPinDragStart = (e) => {
        const { target } = e;
        const pin = this.getPinById(target.id());

        if (!!!pin.selected) {
            this.selectPins([pin.id])
        }
    }

    onPinDrag = (e) => {
        const { target } = e;
        const pin = this.getPinById(target.id())
        const movement = {
            x: target.x() - pin.x_coordinate,
            y: target.y() - pin.y_coordinate
        };

        this.scrollStageIfNessecary({ x: window.event.clientX, y: window.event.clientY })

        this.moveSelectedPins(movement)

    }

    onPinDragEnd = (e) => this.onPinMoveEnd()

    onPinDoubleClick = (id) => this.props.onPinView(id)

    // ===== CONTEXT MENU =====

    onContextMenu = (e) => {
        const stage = this.stage.current;
        const { target } = e;

        e.evt.preventDefault()
        this.selectionBox.hideSelectionBox()
        const coords = this.calculateStageOffset(stage.getPointerPosition())
        this.contextMenu.createContextMenu(coords)
        if (target === stage) {
            this.selectPins([])
        } else if (target.parent.name() === "pin") {
            const pin = this.getPinById(target.parent.id())
            if (!!!pin.selected) {
                this.selectPins([pin.id])
            }
        }
    }

    generateContextMenuOptions = () => {
        const { x, y } = this.contextMenu.getCoords(this.state)
        let returnValue = []
        returnValue.push({ name: 'Create Pin', func: () => { this.props.showPinEditor(x, y); this.contextMenu.hideContextMenu(); } })
        if (!!this.getSelectedPins().length) {
            returnValue.push({ name: "Delete Pin", func: () => { this.deleteSelectedPins(); this.contextMenu.hideContextMenu(); } })
        }
        return returnValue
    }

    // ===== SCROLL =====

    onWheel = (e) => {
        e.evt.preventDefault()
        this.selectionBox.hideSelectionBox()
        this.contextMenu.hideContextMenu()
        this.move(this.props.x - e.evt.deltaX, this.props.y - e.evt.deltaY)
    }


    render() {
        const offsetStyle = {
            backgroundPosition:
                this.props.x + "px " + this.props.y + "px"
        }
        const selc = this.selectionBox.calculateSelectionBox(this.state)
        const conMenu = this.contextMenu.getCoords(this.state)

        const midPointOfSelection = this.getCenterPointOfPins(this.getSelectedPinsIds())

        return (
            <div
                tabIndex='0'
                className={"stage-view " + (this.state.grab ? "grabbing" : "")}
            >

                <Stage
                    height={this.props.height}
                    width={this.props.width}
                    style={offsetStyle}
                    className='scrolling-stage'
                    ref={this.stage}
                    onContextMenu={this.onContextMenu}
                    onMouseDown={this.onMouseDownOnStage}
                    draggable={this.state.grab}
                    onDragMove={this.onStageDrag}

                    onWheel={this.onWheel}

                    x={this.props.x}
                    y={this.props.y}
                >
                    <Layer>
                        {
                            this.props.pins.map((pin) => {
                                return <ImagePin
                                    key={pin.id}
                                    id={pin.id}
                                    name="pin"
                                    x={pin.x_coordinate}
                                    y={pin.y_coordinate}
                                    title={pin.title}
                                    thumbnails={pin.images}
                                    draggable={!this.state.grab}
                                    selected={pin.selected}
                                    onDragStart={this.onPinDragStart}
                                    onDragMove={this.onPinDrag}
                                    onDragEnd={this.onPinDragEnd}
                                    onDblClick={this.onPinDoubleClick}
                                />
                            })
                        }

                        {midPointOfSelection && (
                            <Rect
                                name="e"
                                x={midPointOfSelection.x}
                                y={midPointOfSelection.y}
                                height={4}
                                width={4}
                                fill="red"
                            />
                        )}

                        {this.state.leftSideOfScreen && (
                            <Rect
                                name="e"
                                x={0 - this.props.x}
                                y={0 - this.props.y}
                                height={this.props.height}
                                width={15}
                                fill="red"
                                opacity={0.5}
                            />
                        )}

                        {this.selectionBox.isVisible(this.state) && (
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






                        {this.contextMenu.isVisible(this.state) && (
                            <ContextMenu
                                x={conMenu.x}
                                y={conMenu.y}
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