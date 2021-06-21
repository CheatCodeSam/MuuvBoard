import React from 'react'


class PinView extends React.Component {

    constructor(props) {
        super(props)
        this.image
    }

    loadImage



    render() {

        return (
            <div className='overlay'>
                <div className="pin-view">
                    <div className='exit-button' onClick={this.props.onEscape}>
                        X
                    </div>

                    <div>{this.props.data.title}</div>
                    <div>{this.props.data.id}</div>
                    <div>{this.props.data.image}</div>


                </div>

            </div>
        )
    }

}

export default PinView;