import React from 'react'
import { Stage, Layer, Rect, Group, Text } from 'react-konva';


const stageStyles = {
    backgroundColor: "#e5e5f7",
};

class ScrollingStage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, mousePos: { x: 0, y: 0 } };
        this.layerRef = React.createRef();
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        return (
            <Stage width={this.state.width} height={this.state.height} style={stageStyles} onMouseMove={e => {
                var transform = this.layerRef.current.getAbsoluteTransform().copy();
                transform.invert();
                const pos = e.target.getStage().getPointerPosition();
                var circlePos = transform.point(pos);
                this.setState({ mousePos: circlePos });
            }}
            >
                <Layer>
                    <Group x={0} y={0}>
                        <Rect
                            width={100}
                            height={20}
                            fill="black"
                            opacity={0.3} />
                        <Text text={`${this.state.mousePos.x.toFixed()}, ${this.state.mousePos.y.toFixed()}`} fill="white" align="center" verticalAlign="middle" width={100} height={20} fontSize={15} />
                    </Group>
                </Layer>
                <Layer offsetX={-window.innerWidth / 2} offsetY={-window.innerHeight / 2} ref={this.layerRef}>
                    <Rect
                        x={0}
                        y={0}
                        height={2}
                        width={2}
                        fill={'red'}
                    />
                    {this.props.children}
                </Layer>

            </Stage>
        )
    }
}

export default ScrollingStage;