import axios from 'axios'
import React from 'react'
import { MainContext } from '../context/MainContext';



class PinView extends React.Component {
    static contextType = MainContext;
    constructor(props) {

        super(props)
        this.url = `${process.env.REACT_APP_BASE_URL}/api/pins/${this.props.pinId}/`
        this.state = { loading: true, data: {} }

    }

    componentDidMount() {
        axios.get(this.url, {
            headers: {
                'Authorization': `token ${this.context.token}`
            }
        }).then(response => {
            this.setState({
                loading: false,
                data: response.data
            })
        })
    }

    getRender = () => {
        if (this.state.loading) {
            return this.renderLoading()
        } else {
            return this.renderPin()

        }

    }

    renderLoading = () => {
        return <h1>Loading</h1>
    }

    renderPin = () => {
        return (
            <div>
                {
                    this.state.data.images.map(image => {
                        return <img src={image.image} width={300} height={300} />
                    })
                }
                <div>{this.state.data.title}</div>
                <div>{this.state.data.id}</div>
                <div>{this.state.data.image}</div>
            </div>
        )
    }




    render() {

        return (
            <div className='overlay'>
                <div className="pin-view">
                    <div className='exit-button' onClick={this.props.onEscape}>
                        X
                    </div>

                    {this.getRender()}


                </div>

            </div>
        )
    }

}

export default PinView;