import * as PIXI from "pixi.js"

class PinIndex extends PIXI.Container {
    constructor(number_of_images, setImage) {
        super()

        this.setImage = setImage
        this.currently_shown_image = 1
        this.number_of_images = number_of_images

        this.number_of_images_container = null
        this.number_of_images_number = null

        // this.active = false

        this._setup()
    }

    _setup = () => {
        this.number_of_images_container = new PIXI.Graphics()
        this.number_of_images_container.beginFill(0x0, 0.8)
        this.number_of_images_container.drawRoundedRect(0, 0, 27, 18, 45)
        this.number_of_images_container.endFill()

        this.number_of_images_number = new PIXI.Text(
            this.number_of_images.toString(),
            {
                fontFamily: "Arial",
                fontSize: 10,
                fill: 0xffffff,
            }
        )

        this._updateNumberOfImages()

        this.hitArea = new PIXI.Rectangle(0, 0, 27, 18)

        // this.on("mouseover", this._mouseOver)
        // this.on("mouseout", this._mouseOut)

        this.addChild(this.number_of_images_container)
        this.addChild(this.number_of_images_number)
    }

    _updateNumberOfImages = () => {
        if (this.currently_shown_image == 1) {
            this.number_of_images_number.text = this.number_of_images.toString()
        } else {
            this.number_of_images_number.text =
                this.currently_shown_image.toString() +
                "/" +
                this.number_of_images.toString()
        }

        this.number_of_images_number.x =
            27 / 2 - this.number_of_images_number.width / 2
        this.number_of_images_number.y = 4
    }

    // _setImage = i => {
    //     this.setImage(i - 1)
    //     this.currently_shown_image = i
    //     this._updateNumberOfImages()
    // }

    // activate = () => {
    //     this.number_of_images_number.visible = false

    //     this.active = true
    // }
    // deactivate = () => {
    //     this.number_of_images_number.visible = true

    //     this.active = false
    // }

    // _mouseOver = () => {
    //     this.activate()
    // }

    // _mouseOut = () => {
    //     this.deactivate()
    // }
}

export default PinIndex
