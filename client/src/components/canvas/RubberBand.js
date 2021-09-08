import * as PIXI from "pixi.js"

const overlap = (A, B) => {
    const valueInRange = (value, min, max) => value >= min && value <= max

    const xOverlap =
        valueInRange(A.x, B.x, B.x + B.width) ||
        valueInRange(B.x, A.x, A.x + A.width)

    const yOverlap =
        valueInRange(A.y, B.y, B.y + B.height) ||
        valueInRange(B.y, A.y, A.y + A.height)

    return xOverlap && yOverlap
}

class RubberBand extends PIXI.Graphics {
    constructor() {
        super()
        this.selecting = false

        this.color = 0xa9ccfa
        this.opacity = 0.25
        this.borderSize = 1
        this.borderColor = 0x006eff

        this.x1 = 0
        this.y1 = 0
        this.x2 = 0
        this.y2 = 0
    }

    start = point => {
        this.clear()
        this.selecting = true

        this.x1 = point.x
        this.y1 = point.y
        this.x2 = point.x
        this.y2 = point.y
    }

    move = point => {
        if (this.selecting) {
            this.clear()

            this.x2 = point.x
            this.y2 = point.y

            let x = Math.min(this.x1, this.x2)
            let y = Math.min(this.y1, this.y2)
            let width = Math.max(this.x1, this.x2) - x
            let height = Math.max(this.y1, this.y2) - y

            this.lineStyle(this.borderSize, this.borderColor, 1)
            this.beginFill(this.color, this.opacity)
            this.drawRect(x, y, width, height)

            return true
        } else {
            return false
        }
    }

    end = _ => {
        if (this.selecting) {
            this.clear()
            this.selecting = false
            return true
        }
        return false
    }

    isRectIntersecting = rect => {
        const r1 = {
            x: Math.min(this.x1, this.x2),
            y: Math.min(this.y1, this.y2),
            width: Math.abs(this.x1 - this.x2),
            height: Math.abs(this.y1 - this.y2),
        }
        return overlap(r1, rect)
    }

    isVisible = _ => {
        return this.selecting
    }
}

export default RubberBand
