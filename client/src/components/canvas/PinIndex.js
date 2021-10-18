import * as PIXI from "pixi.js"

class PinIndex extends PIXI.Container {
    constructor(number_of_images, next, prev) {
        super()

        this.next = next
        this.prev = prev
        this.number_of_images = number_of_images

        this.number_of_images_container = null
        this.number_of_images_number = null

        this._setup()
    }

    _setup = () => {
        this.number_of_images_container = new PIXI.Graphics()
        this.number_of_images_container.beginFill(0x0, 0.8)
        this.number_of_images_container.drawRoundedRect(0, 0, 27, 18, 45)
        this.number_of_images_container.endFill()

        this._drawNumberOfImages()

        this.addChild(this.number_of_images_container)
        this.addChild(this.number_of_images_number)
    }

    _drawNumberOfImages = () => {
        const style = new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: 10,
            fill: 0xffffff,
        })
        this.number_of_images_number = new PIXI.Text(
            this.number_of_images.toString(),
            style
        )

        // this.number_of_images_number.width
        this.number_of_images_number.x =
            27 / 2 - this.number_of_images_number.width / 2
        this.number_of_images_number.y = 4
    }
}

export default PinIndex
