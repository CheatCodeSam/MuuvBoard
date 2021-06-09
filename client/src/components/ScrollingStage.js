import React from 'react'
import { Stage, Layer, Rect, Group, Text } from 'react-konva';


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
    pan: {
        grabDown: false,
        grab: false,
        quickPan: false,
    }
}

const stageStyles = {
    backgroundColor: "#e5e5f7",
    opacity: 0.8,
    backgroundImage: "radial-gradient(#444cf7 1.1px, #e5e5f7 1.1px)",
    backgroundSize: "22px 22px",

}

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

    calculateStageOffset = (coords) => { }

    deselectAllBoxes = () => { }

    getSelectedBoxes = () => { }

    selectBoxes = (id) => { }

    generateSelectionBox = () => { }

    selectCursor = () => { }

    createBox = () => { }

    deleteSelectedBoxes = () => { }

    // ===== INPUT =====

    onMouseDown = (e) => { }

    onMouseUp = (e) => { }

    onMouseMove = (e) => { }

    handleKeyPress = (e) => { }

    // ===== STAGE EVENTS =====

    onStageDrag = (e) => { }

    onStageDragEnd = (e) => { }

    // ===== PIN EVENTS =====

    onPinDragStart = (e) => { }

    onPinDrag = (e) => { }

    onPinDragEnd = (e) => { }

    // ===== CONTEXT MENU =====

    onContextMenu = (e) => { }

    generateContextMenuOptions = () => { }





    render() {
        const offsetStyle = {
            ...stageStyles,
            backgroundPosition:
                this.state.stageOffset.x + "px " + this.state.stageOffset.y + "px"
        }

        return (
            <div
                tabIndex='0'
            >
                <Stage
                    height={window.innerWidth}
                    width={window.innerHeight}
                    style={offsetStyle}

                >
                    <Layer>

                    </Layer>
                </Stage>

            </div>
        )


    }

}

export default ScrollingStage;