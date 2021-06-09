import React from "react";
import { Html } from "react-konva-utils";

class ContextMenu extends React.Component {
    render() {
        return (
            <Html
                divProps={{
                    style: {
                        position: "absolute",
                        top: this.props.y + 3 + "px",
                        left: this.props.x + 3 + "px"
                    },
                    className: "menu"
                }}
            >
                <div onContextMenu={e => e.preventDefault()}>
                    {this.props.options.map((option) => {
                        return (
                            <button key={option.name} onClick={option.func}>
                                {option.name}
                            </button>
                        );
                    })}
                </div>
            </Html>
        );
    }
}

export default ContextMenu;
