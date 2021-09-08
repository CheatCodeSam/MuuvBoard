import * as PIXI from "pixi.js"
import DraggableContainer from "./DraggableContainer"

class Pin extends DraggableContainer {
    constructor(data) {
        super()

        this.data = data
        this.name = "pin"
        this.id = data.id

        this._isSelected = data.selected

        this.interactive = true

        this.image = null
        this.border = null
        this.selectionBorder = null

        this._setup()
    }

    _setup = () => {
        this.image = PIXI.Sprite.from(this.data.images[0].thumbnail)
        this.image.width = 120
        this.image.height = 120
        this.image.position.set(4, 4)

        const imageMask = new PIXI.Graphics()
        imageMask.beginFill(0xffffff)
        imageMask.drawRoundedRect(4, 4, 120, 120, 8)
        imageMask.endFill()

        this.image.mask = imageMask

        this.border = new PIXI.Graphics()
        this.border.beginFill(0xffffff)
        this.border.drawRoundedRect(0, 0, 128, 128, 12)
        this.border.endFill()

        this.dropShadow = new PIXI.Graphics()
        this.dropShadow.beginFill(0x000000)
        this.dropShadow.drawRoundedRect(0, 4, 128, 128, 12)
        this.dropShadow.endFill()
        this.dropShadow.alpha = 0.25
        this.dropShadow.filters = [new PIXI.filters.BlurFilter(4)]

        this.selectionBorder = new PIXI.Graphics()
        this.selectionBorder.beginFill(0x89abe3)
        this.selectionBorder.drawRoundedRect(-2, -2, 132, 132, 13)
        this.selectionBorder.endFill()
        this.selectionBorder.visible = false

        this.addChild(this.dropShadow)
        this.addChild(this.selectionBorder)
        this.addChild(this.border)
        this.addChild(imageMask)
        this.addChild(this.image)
    }

    get selected() {
        return this._isSelected
    }

    set selected(value) {
        this._isSelected = value
        this.drawSelection()
    }

    drawSelection = () => {
        if (this._isSelected) {
            this.selectionBorder.visible = true
        }
        if (!this._isSelected) {
            this.selectionBorder.visible = false
        }
    }
}

export default Pin
