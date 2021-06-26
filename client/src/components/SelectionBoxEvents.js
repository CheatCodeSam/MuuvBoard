import Konva from "konva";



class SelectionBoxEvents {
    constructor(setState) {
        this.setState = setState
    }

    getState = () => {
        return {
            selectionVisible: false,
            selectionX1: null,
            selectionY1: null,
            selectionX2: null,
            selectionY2: null
        }
    }

    isVisible = (state) => {
        return state.selectionVisible
    }

    hideSelectionBox = () => {
        this.setState({ selectionVisible: false })
    }

    calculateSelectionBox = (state) => {
        return {
            x: Math.min(state.selectionX1, state.selectionX2),
            y: Math.min(state.selectionY1, state.selectionY2),
            height: Math.abs(state.selectionY2 - state.selectionY1),
            width: Math.abs(state.selectionX2 - state.selectionX1)
        };
    }

    selectionBoxCreate = (coords) => {
        const { x, y } = coords

        this.setState({
            selectionVisible: true,
            selectionX1: x,
            selectionY1: y,
            selectionX2: x,
            selectionY2: y
        })

    }

    selectionBoxMove = (coords) => {
        const { x, y } = coords

        this.setState({
            selectionX2: x,
            selectionY2: y
        })
    }

    selectionBoxEnd = (state, pins) => {
        this.hideSelectionBox()
        const selectionBox = this.calculateSelectionBox(state)
        const selected = pins.filter(pin => Konva.Util.haveIntersection(selectionBox, { x: pin.x(), y: pin.y(), width: pin.width(), height: pin.height() }))
        return selected;
    }

}

export default SelectionBoxEvents;