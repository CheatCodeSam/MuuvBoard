import React from 'react'
import { Stage, Layer, Rect } from 'react-konva';
import Konva from "konva";
import ContextMenu from './ContextMenu';
import ImagePin from './ImagePin'
import PinView from './PinView';
import SelectionBoxEvents from './SelectionBoxEvents';
import ContextMenuEvents from './ContextMenuEvents';


const MOUSEONE = 0;
const MOUSETWO = 2;
const MOUSETHREE = 1;

class ScrollingStage extends React.Component {

    constructor(props) {
        super(props);
        this.setState = this.setState.bind(this);
        this.stage = React.createRef()
        this.selectionBox = new SelectionBoxEvents(this.setState);
        this.contextMenu = new ContextMenuEvents(this.setState);
        this.state = {
            width: 0, height: 0,
            stageOffset: {
                x: 0,
                y: 0
            },
            showPinEditor: false,
            showPinView: false,
            pinToView: 0,
            grab: false,
            ...this.selectionBox.getState(),
            ...this.contextMenu.getState(),
        }
    }
    // ===== LIFE CYCLE =====

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('mouseup', this.onMouseUpWindow)
        window.addEventListener('mousemove', this.onMouseMoveWindow)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('mouseup', this.onMouseUpWindow);
        window.removeEventListener('mousemove', this.onMouseMoveWindow)
    }

    // ===== UTIL =====

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    calculateStageOffset = (coords) => {
        return { x: coords.x - this.state.stageOffset.x, y: coords.y - this.state.stageOffset.y };
    }

    getSelectedPins = () => this.props.pins.filter(pin => pin.selected);

    getSelectedPinsIds = () => this.props.pins.filter(pin => pin.selected).map(pin => pin.id)

    getPinById = (id) => this.props.pins.find(pin => pin.id === id);

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
            const coords = this.calculateStageOffset({ x: e.clientX, y: e.clientY })
            this.selectionBox.selectionBoxMove(coords)
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

        this.moveSelectedPins(movement)

    }

    onPinDragEnd = (e) => {
        this.onPinMoveEnd()
    }

    onPinDoubleClick = (e) => {
        const { target } = e;
        this.setState({ showPinView: true, pinToView: target.parent.id() })
    }

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


    render() {
        const offsetStyle = {
            backgroundPosition:
                this.state.stageOffset.x + "px " + this.state.stageOffset.y + "px"
        }
        const selc = this.selectionBox.calculateSelectionBox(this.state)
        const conMenu = this.contextMenu.getCoords(this.state)

        return (
            <div
                tabIndex='0'
                className={"stage-view " + (this.state.grab ? "grabbing" : "")}
            >
                {this.state.showPinView &&
                    <PinView
                        data={this.getPinById(this.state.pinToView)}
                        onEscape={() => this.setState({ showPinView: false })}
                    />
                }

                <Stage
                    height={this.state.height}
                    width={this.state.width}
                    style={offsetStyle}
                    className='scrolling-stage'
                    ref={this.stage}
                    onContextMenu={this.onContextMenu}
                    onMouseDown={this.onMouseDownOnStage}
                    draggable={this.state.grab}
                    onDragMove={this.onStageDrag}
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