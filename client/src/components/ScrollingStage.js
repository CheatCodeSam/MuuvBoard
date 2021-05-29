import React from 'react'
import { Stage, Layer, Rect } from 'react-konva';


const stageStyles = {
    backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
    backgroundSize: "10px 10px",
    backgroundColor: "#e5e5f7",
    opacity: "0.8"
};

class ScrollingStage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        return (
            <Stage width={this.state.width} height={this.state.height} style={stageStyles}  >
                <Layer offsetX={-window.innerWidth / 2} offsetY={-window.innerHeight / 2}>
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