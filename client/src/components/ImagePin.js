import React, { useState } from 'react';
import { Rect, Text, Image, Group } from 'react-konva';
import useImage from 'use-image'


function ImagePin(props) {

    let url
    if (props.thumbnail.includes('blob')) {
        url = props.thumbnail
    } else {
        url = `${process.env.REACT_APP_BASE_URL}${props.thumbnail}`
    }

    const [image] = useImage(url);

    return (
        <Group
            x={props.x}
            y={props.y}
            id={props.id}
            draggable={props.draggable}
            onDragStart={props.onDragStart}
            onDragMove={props.onDragMove}
            onDragEnd={props.onDragEnd}
            onDblClick={props.onDblClick}
            name={props.name}
            width={135}
            height={160}
        >
            <Rect
                x={0}
                y={0}
                width={135}
                height={160}
                fill={"white"}
                shadowBlur={4}
                shadowOffsetY={4}
                shadowOpacity={0.25}
                strokeEnabled={props.selected}
                stroke='rgba(21, 156, 228, 0.4)'
                strokeWidth={5}
                hitStrokeWidth={0}
                shadowForStrokeEnabled={false}

            />
            <Image width={120} height={120} x={7} y={7} image={image} />
            <Text text={props.title} align="center" width={135} height={32} y={128} fontSize={12} />
        </Group >
    )
}

export default ImagePin;