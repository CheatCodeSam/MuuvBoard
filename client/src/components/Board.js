import React from 'react';
import { Stage, Layer, Rect, Text, Image, Line, Group } from 'react-konva';
import useImage from 'use-image'

const LionImage = () => {
    const [image] = useImage('https://konvajs.org/assets/yoda.jpg');
    return <Image width={215} height={215} x={17.5} y={17.5} image={image} />;
};


function Board() {

    const stageStyles = {
        backgroundImage: "radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px)",
        backgroundSize: "10px 10px",
        backgroundColor: "#e5e5f7",
        opacity: "0.8"
    };

    return (
        <Stage width={1000} height={1000} style={stageStyles}  >
            <Layer>

                <Group draggable>
                    <Rect
                        x={0}
                        y={0}
                        width={250}
                        height={300}
                        fill="white"
                        shadowBlur={10}
                    />
                    <LionImage />
                    <Text text="Yoba from Space" align="center" width={250} y={215 + 17.5 + 10} fontSize={15} />
                </Group>
            </Layer>
        </ Stage>
    )
}

export default Board;