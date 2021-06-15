import React from 'react'

class PinEditor extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className="pin-editor" onClick={this.props.onEscape}>

            </div>
        )
    }
}

export default PinEditor;