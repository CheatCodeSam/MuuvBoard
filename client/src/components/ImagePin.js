import React, { useState } from "react"
import { Rect, Text, Image, Group } from "react-konva"
import useImage from "use-image"

function ImagePin(props) {
    const url = `${props.thumbnails[0].thumbnail}`
    const mutliImages = props.thumbnails.length > 1

    const generateIndexBox = () => {
        return (
            <Group x={127 - 2 - 30} y={7 + 2} width={30} height={16}>
                <Rect
                    width={30}
                    height={16}
                    opacity={0.8}
                    fill="black"
                    cornerRadius={5}
                />
                <Text
                    text={props.thumbnails.length}
                    align="center"
                    width={30}
                    height={16}
                    y={2}
                    fontSize={12}
                    fill="white"
                />
            </Group>
        )
    }

    const calcClipFunc = ctx => {
        const width = 120,
            height = 120,
            x = 7,
            y = 7,
            radius = 8

        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.lineTo(x + width - radius, y)
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
        ctx.lineTo(x + width, y + height - radius)
        ctx.quadraticCurveTo(
            x + width,
            y + height,
            x + width - radius,
            y + height
        )
        ctx.lineTo(x + radius, y + height)
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
        ctx.lineTo(x, y + radius)
        ctx.quadraticCurveTo(x, y, x + radius, y)
        ctx.closePath()
    }

    const [image] = useImage(url)

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
                height={135}
                fill={"white"}
                // Disabled for a while for performance
                shadowEnabled={false}
                shadowBlur={4}
                shadowOffsetY={4}
                shadowOpacity={0.25}
                strokeEnabled={props.selected}
                stroke="rgba(21, 156, 228, 0.4)"
                strokeWidth={5}
                hitStrokeWidth={0}
                shadowForStrokeEnabled={false}
                cornerRadius={16}
            />
            <Group clipFunc={calcClipFunc} listening={false}>
                <Image width={120} height={120} x={7} y={7} image={image} />
            </Group>

            {mutliImages && generateIndexBox()}
        </Group>
    )
}

export default ImagePin
