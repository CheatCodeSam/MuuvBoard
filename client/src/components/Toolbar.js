import React from 'react'
import { Link } from "react-router-dom";
import { ChevronDownIcon, HomeIcon } from '@heroicons/react/outline'


class Toolbar extends React.Component {

    render() {
        return (
            <div className='toolbar'>
                <Link to="/">
                    <div className="home-container">
                        <HomeIcon style={{ height: "20px", width: "20px", color: "white" }} />
                    </div>
                </Link>

                <div className="filename-view">
                    <span className='filename-title'>
                        {this.props.title}
                    </span>
                    <div className="chevron-container">
                        <ChevronDownIcon style={{ height: "10px", width: "10px" }} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Toolbar;