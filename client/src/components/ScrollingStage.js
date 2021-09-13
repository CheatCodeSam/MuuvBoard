import React from "react"
import Pin from "./canvas/Pin"
import RubberBand from "./canvas/RubberBand"
import { Viewport } from "pixi-viewport"
import * as PIXI from "pixi.js"
import ContextMenu from "./ContextMenu"

const absolutePosition = (e, viewport) => {
    return { x: e.x + viewport.left, y: e.y + viewport.top }
}

const MOUSEONE = 0
const MOUSETWO = 2
// const MOUSETHREE = 1;

//TODO use PIXI layers

class ScrollingStage extends React.Component {
    constructor(props) {
        super(props)

        this.canvasRef = React.createRef()
        this.app = null
        this.viewport = null
        this.pins = []
        this.rubberBand = null

        this.state = {
            initialized: false,
            contextMenuVisible: false,
            contextMenuShowX: null,
            contextMenuShowY: null,
            contextMenuClickedX: null,
            contextMenuClickedY: null,
        }
    }

    // === LIFECYCLE ===

    componentDidMount() {
        const canvas = this.canvasRef.current

        const app = new PIXI.Application({
            backgroundAlpha: 0,
            resolution: 1,
            view: canvas,
            antialias: true,
            sharedTicker: true,
        })

        app.renderer.resize(this.props.width, this.props.height)

        const isSafari = window.safari !== undefined
        if (isSafari) {
            PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL
        }

        app.stage.interactive = true
        app.stage.hitArea = app.renderer.screen

        app.stage.sortableChildren = true

        this.app = app

        PIXI.Ticker.shared.maxFPS = 60

        this.initializeBoard(this.app)
    }

    initializeBoard = app => {
        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            passiveWheel: false,

            interaction: app.renderer.plugins.interaction,
        })

        viewport.sortableChildren = true

        viewport.drag({ mouseButtons: "middle" }).pinch()

        viewport.on("moved", viewport => {
            this.hideContextMenu()
            this.props.onStagePan({
                x: -viewport.viewport.left,
                y: -viewport.viewport.top,
            })
        })

        viewport.on("drag-start", _ => (viewport.cursor = "grabbing"))
        viewport.on("drag-end", _ => (viewport.cursor = "default"))

        this.viewport = viewport

        app.stage.addChild(this.viewport)

        this.props.pins.forEach(this.createNewPin)

        const rubberBand = new RubberBand()
        this.rubberBand = rubberBand
        viewport.addChild(this.rubberBand)
        this.rubberBand.zIndex = 9999

        app.stage.on("pointerdown", this.onAppPointerDown)

        app.stage.on("pointermove", this.onAppPointerMove)

        app.stage.on("pointerup", this.onAppPointerUp)

        app.stage.on("pointerupoutside", this.onAppPointerUp)

        window.addEventListener("gesturestart", e => e.preventDefault())

        this.setState({ initialized: true })
    }

    componentDidUpdate(prevProps) {
        if (!!!this.state.initialized) {
            return
        }

        if (this.props.x !== prevProps.x) {
            // If the reason the prop coordinates are different then the viewport
            // isn't because we move it, then manually move the viewport
            if (this.props.x !== -this.viewport.left) {
                this.viewport.left = -this.props.x
            }
        }

        if (this.props.y !== prevProps.y) {
            if (this.props.y !== -this.viewport.top) {
                this.viewport.top = -this.props.y
            }
        }

        if (this.props.height !== prevProps.height) {
            this.app.renderer.resize(this.props.width, this.props.height)
            this.viewport.resize(this.props.width, this.props.height)
        }

        if (this.props.width !== prevProps.width) {
            this.app.renderer.resize(this.props.width, this.props.height)
            this.viewport.resize(this.props.width, this.props.height)
        }

        if (this.props.pins !== prevProps.pins) {
            let pinsOperatedOn = []
            let index = 1
            this.props.pins.forEach(pinPOD => {
                let pinToModify = this.getPin(pinPOD.id)

                if (!!!pinToModify) {
                    pinToModify = this.createNewPin(pinPOD)
                }

                if (pinToModify.x !== pinPOD.x) {
                    pinToModify.x = pinPOD.x_coordinate
                }
                if (pinToModify.y !== pinPOD.y) {
                    pinToModify.y = pinPOD.y_coordinate
                }

                if (pinToModify.selected !== pinPOD.selected) {
                    pinToModify.selected = pinPOD.selected
                }

                pinToModify.zIndex = index
                index++

                pinsOperatedOn.push(pinToModify)
            })
            this.pins
                .filter(p => !!!pinsOperatedOn.includes(p))
                .forEach(this.deletePin)
        }
    }

    componentWillUnmount() {
        this.app.destroy(true, true)
    }

    getPin = id => this.pins.find(p => p.id === id)

    // === PINS ===

    createNewPin = pinData => {
        const moveSelectedPins = (e, movement) => {
            const ids = []
            this.pins.forEach(pin => {
                if (pin.selected) {
                    pin.x += movement.dx
                    pin.y += movement.dy
                    ids.push(pin.id)
                }
            })

            this.props.onPinMove(movement, ids)
        }

        const pinMoveEnd = _ => {
            this.props.onPinMoveEnd(this.getSelectedPins().map(p => p.id))
        }

        const pinContainer = new Pin(pinData)
        pinContainer.on("dragmove", moveSelectedPins)
        pinContainer.on("dragend", pinMoveEnd)
        pinContainer.on("dblclick", _ => this.props.onPinView(pinData.id))
        pinContainer.x = pinData.x_coordinate
        pinContainer.y = pinData.y_coordinate
        pinContainer.zIndex = 1
        this.pins.push(pinContainer)
        this.viewport.addChild(pinContainer)
        return pinContainer
    }

    deletePin = pin => {
        this.pins = this.pins.filter(p => p !== pin)
        this.viewport.removeChild(pin)
    }

    getSelectedPins = _ => this.pins.filter(p => p.selected)

    selectPins = pins => {
        this.pins.forEach(pin => {
            pin.selected = false
        })
        pins.forEach(pin => {
            pin.selected = true
        })

        this.props.onPinSelect(pins.map(p => p.id))
    }

    showContextMenu = coords => {
        const onCanvas = absolutePosition(coords, this.viewport)
        this.setState({
            contextMenuVisible: true,
            contextMenuShowX: coords.x,
            contextMenuShowY: coords.y,
            contextMenuClickedX: onCanvas.x,
            contextMenuClickedY: onCanvas.y,
        })
    }

    hideContextMenu = _ => {
        this.setState({
            contextMenuVisible: false,
        })
    }

    // === EVENTS ===

    onAppPointerDown = e => {
        if (e.data.originalEvent.button === MOUSEONE) {
            this.hideContextMenu()
            if (e.target === this.viewport) {
                this.selectPins([])
                this.rubberBand.start(
                    absolutePosition(e.data.global, this.viewport)
                )
            }
            if (this.pins.includes(e.target)) {
                const pin = e.target
                if (!!!pin.selected) {
                    this.selectPins([pin])
                }
            }
        }
        if (e.data.originalEvent.button === MOUSETWO) {
            if (e.target === this.viewport) {
                this.selectPins([])
            }
            if (this.pins.includes(e.target)) {
                const pin = e.target
                if (!!!pin.selected) {
                    this.selectPins([pin])
                }
            }
            this.showContextMenu(e.data.global)
        }
    }

    onAppPointerMove = e => {
        let rubberBand = this.rubberBand // ????
        if (rubberBand.isVisible()) {
            rubberBand.move(absolutePosition(e.data.global, this.viewport))
            const pins = this.pins.filter(rubberBand.isRectIntersecting)
            this.selectPins(pins)
        }
    }

    onAppPointerUp = e => {
        if (this.rubberBand.isVisible()) {
            this.rubberBand.end(e)
        }
    }

    render() {
        // const stageSize = {
        //     height: this.props.height + "px ",
        //     width: this.props.width + "px",
        // }

        // this lags, look into using a GLSL Shader for background
        const offsetStyle = {
            // backgroundPosition: this.props.x + "px " + this.props.y + "px",
        }

        return (
            <div className="stage">
                <div className="stage-background" style={offsetStyle}></div>
                <canvas
                    ref={this.canvasRef}
                    className="stage-canvas"
                    onContextMenu={e => e.preventDefault()}
                />
                <p className="coordinate-display">
                    {this.props.x}, {this.props.y}
                </p>
                {this.state.contextMenuVisible && (
                    <ContextMenu
                        x={this.state.contextMenuShowX}
                        y={this.state.contextMenuShowY}
                        canvasX={this.state.contextMenuClickedX}
                        canvasY={this.state.contextMenuClickedY}
                        options={this.props.contextMenuOptions}
                        onAction={this.hideContextMenu}
                    />
                )}
            </div>
        )
    }
}

export default ScrollingStage
