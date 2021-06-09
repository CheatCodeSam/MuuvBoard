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

    calculateStageOffset = (coords) => { }

    deselectAllBoxes = () => { }

    getSelectedBoxes = () => { }

    selectBoxes = (id) => { }

    generateSelectionBox = () => { }

    createBox = () => { }

    deleteSelectedBoxes = () => { }

    // ===== INPUT =====

    onMouseDown = (e) => {
        const stage = this.stage.current;
        const { target } = e;

        if (e.evt.button === MOUSETHREE) {
            e.evt.preventDefault();
            this.setState({ grab: true });
        }
    }

    onMouseUp = (e) => {
        if (this.state.grab) {
            this.setState({ grab: false });
        }
    }

    onMouseMove = (e) => { }

    // ===== STAGE EVENTS =====

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
                className={this.state.grab ? "grabbing" : ""}
            >
                <Stage
                    height={window.innerHeight}
                    width={window.innerWidth}
                    style={offsetStyle}
                    ref={this.stage}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    draggable={this.state.grab}
                    onDragMove={this.onStageDrag}
                >
                    <Layer>

                    </Layer>
                </Stage>

            </div>
        )


    }

}

export default ScrollingStage;