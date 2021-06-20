import React from 'react'


class PinView extends React.Component {




    render() {
        return (
            <div className='overlay'>
                <div>{this.props.pinId}</div>
                <div className='exit-button' onClick={this.props.onEscape}>
                    X
                </div>
            </div>
        )
    }

}

export default PinView;