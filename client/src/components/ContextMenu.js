const ContextMenu = props => {
    const coords = { x: props.canvasX, y: props.canvasY }
    return (
        <div
            className="menu"
            style={{
                top: props.y + 3 + "px",
                left: props.x + 3 + "px",
            }}
            onContextMenu={e => e.preventDefault()}
        >
            {props.options?.map(option => {
                return (
                    <button
                        key={option.name}
                        onClick={_ => {
                            option.func(coords)
                            props.onAction()
                        }}
                    >
                        {option.name}
                    </button>
                )
            })}
        </div>
    )
}

export default ContextMenu
