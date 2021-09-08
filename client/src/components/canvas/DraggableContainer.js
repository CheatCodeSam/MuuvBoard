import * as PIXI from "pixi.js"

const MOUSEONE = 0

class DraggableContainer extends PIXI.Container {
    constructor() {
        super()

        this.interactive = true
        this._draggable = true

        this._dragging = false
        this._dx = 0
        this._dy = 0

        this.on("pointerdown", this._dragStart)
    }

    set draggable(value) {
        this._draggable = value
        if (this.draggable) {
            this.on("pointerdown", this._dragStart)
        } else if (!this.draggable) {
            this.off("pointerdown")
            this._dragEnd()
        }
    }
    get draggable() {
        return this._draggable
    }

    _dragStart = e => {
        if (e.data.originalEvent.button === MOUSEONE) {
            this._dx = e.data.global.x
            this._dy = e.data.global.y

            this._dragging = true

            this.on("pointermove", this._dragMove)
            this.on("pointerup", this._dragEnd)
            this.on("pointerupoutside", this._dragEnd)

            this.emit("dragstart", e)
        }
    }

    _dragMove = e => {
        if (this._dragging) {
            // this.x = this.x + e.data.global.x - this._dx;
            // this.y = this.y + e.data.global.y - this._dy;

            const movement = {
                dx: e.data.global.x - this._dx,
                dy: e.data.global.y - this._dy,
            }

            this._dx = e.data.global.x
            this._dy = e.data.global.y

            this.emit("dragmove", e, movement)
        }
    }

    _dragEnd = e => {
        this._dragging = false

        this.off("pointermove")
        this.off("pointerup")
        this.off("pointerupoutside")

        this.emit("dragend", e)
    }
}

export default DraggableContainer
