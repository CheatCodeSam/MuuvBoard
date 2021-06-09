import React from 'react'
import { Stage, Layer, Rect, Group, Text } from 'react-konva';
import Konva from "konva";
import ContextMenu from './ContextMenu';



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
            pins: props.pins,
            stageOffset: {
                x: 0,
                y: 0
            },
            ...selectionState,
            ...contextMenuState,
            ...panningState
        }
    }

    // ===== UTIL =====

    calculateStageOffset = (coords) => {
        return { x: coords.x - this.state.stageOffset.x, y: coords.y - this.state.stageOffset.y };
    }

    deselectAllBoxes = () => { }

    getSelectedBoxes = () => { }

    selectBoxes = (id) => { }

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


    createBox = () => { }

    deleteSelectedBoxes = () => { }

    hideSelectionBox = () => {
        this.setState({ selection: { ...this.state.selection, visible: false } })
    }

    // ===== STAGE EVENTS =====

    onMouseDownOnStage = (e) => {
        const stage = this.stage.current;
        const { target } = e;

        this.hideContextMenu()

        if (e.evt.button === MOUSEONE) {
            if (target === stage) {
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
            }

        }

        if (e.evt.button === MOUSETHREE) {
            e.evt.preventDefault();
            this.hideSelectionBox()
            this.setState({ grab: true });
        }
    }

    onMouseUp = (e) => {
        if (this.state.selection.visible) {
            this.hideSelectionBox()
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
        const { target } = e
        this.setState({
            stageOffset: {
                x: target.x(),
                y: target.y()
            }
        })
    }

    // ===== PIN EVENTS =====

    onPinDragStart = (e) => { }

    onPinDrag = (e) => { }

    onPinDragEnd = (e) => { }

    // ===== CONTEXT MENU =====

    onContextMenu = (e) => {
        const stage = this.stage.current;
        const { target } = e;

        e.evt.preventDefault()
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
    }

    generateContextMenuOptions = () => {
        return [{ name: 'log Hello', func: () => console.log('hello') }]
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
                <Stage
                    height={window.innerHeight}
                    width={window.innerWidth}
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