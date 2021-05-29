import React, { useState } from 'react';
import { Rect, Text, Image, Group } from 'react-konva';
import useImage from 'use-image'


function ImagePin(props) {

    console.log(props.data)
    const url = `${process.env.REACT_APP_BASE_URL}${props.data.image}`

    const URLImage = () => {
        const [image] = useImage(url);
        return <Image width={215} height={215} x={17.5} y={17.5} image={image} />;
    };


    return (
        <Group
            x={props.data.x_coordinate}
            y={props.data.y_coordinate}
            id={props.data.id}
            draggable
            onDragEnd={props.onDragEnd}
            onClick={() => props.onDelete(props.data.id)}
        >
            <Rect
                x={0}
                y={0}
                width={250}
                height={300}
                fill="white"
                shadowBlur={10}
            />
            <URLImage />
            <Text text={props.data.title} align="center" width={250} y={215 + 17.5 + 25} fontSize={15} />
        </Group >
    )
}

export default ImagePin;