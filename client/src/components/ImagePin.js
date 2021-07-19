import React, { useState } from 'react';
import { Rect, Text, Image, Group } from 'react-konva';
import useImage from 'use-image'


function ImagePin(props) {

    const url = `${props.thumbnails[0].thumbnail}`
    const mutliImages = props.thumbnails.length > 1;

    const generateIndexBox = () => {
        return (
            <Group
                x={127 - 2 - 30}
                y={7 + 2}
                width={30}
                height={16}
            >
                <Rect

                    width={30}
                    height={16}
                    opacity={0.80}
                    fill="black"
                    cornerRadius={5}
                />
                <Text text={props.thumbnails.length} align="center" width={30} height={16} y={2} fontSize={12} fill="white" />
            </Group>
        )
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
            onDblClick={() => props.onDblClick(props.id)}
            name={props.name}
            width={135}
            height={160}
            dragBoundFunc={props.dragBoundFunc}
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
            {mutliImages && generateIndexBox()}
        </Group >
    )
}

export default ImagePin;