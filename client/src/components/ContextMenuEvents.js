
class ContextMenuEvents {
    constructor(setState) {
        this.setState = setState
    }

    getState = () => {
        return {
            contextMenuVisible: false,
            contextMenuX: null,
            contextMenuY: null
        }
    }

    getCoords = (state) => {
        return { x: state.contextMenuX, y: state.contextMenuY }
    }

    hideContextMenu = () => this.setState({ contextMenuVisible: false })

    isVisible = state => state.contextMenuVisible

    createContextMenu = (coords) => {
        const { x, y } = coords
        this.setState({
            contextMenuVisible: true,
            contextMenuX: x,
            contextMenuY: y
        })
    }



}



export default ContextMenuEvents;