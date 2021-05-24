import React, { useState } from 'react';
import { Rect, Text, Image, Group } from 'react-konva';
import useImage from 'use-image'


function ImagePin(props) {

    const LionImage = () => {
        const [image] = useImage(props.imageUrl);
        return <Image width={215} height={215} x={17.5} y={17.5} image={image} />;
    };


    return (
        <Group
            x={props.x}
            y={props.y}
            id={props.id}
            draggable
            onDragEnd={props.onDragEnd}
            onClick={() => props.onDelete(props.id)}
        >
            <Rect
                x={0}
                y={0}
                width={250}
                height={300}
                fill="white"
                shadowBlur={10}
            />
            <LionImage />
            <Text text={props.title} align="center" width={250} y={215 + 17.5 + 25} fontSize={15} />
        </Group >
    )
}

export default ImagePin;