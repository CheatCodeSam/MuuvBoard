import React from 'react'



class Toolbar extends React.Component {

    render() {
        return (
            <div className='toolbar'>
                <div className="filename-view">
                    <span className='filename-title'>
                        {this.props.title}
                    </span>
                </div>
            </div>
        )
    }
}

export default Toolbar;