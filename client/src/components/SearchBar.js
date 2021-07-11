import React from 'react'
import axios from 'axios';
import { Formik } from 'formik';


class SearchBar extends React.Component {


    render() {
        return (
            <div className="searchbar">


                <Formik
                    initialValues={{ query: 'd' }}
                    onSubmit={(values, actions) => {
                        this.props.onSearch(values.query)
                    }}
                >
                    {props => (
                        <form onSubmit={props.handleSubmit}>
                            <input type="text" onChange={props.handleChange} className='searchbar-input' name="query" onBlur={props.handleBlur} />
                            {props.errors.name && <div id="feedback">{props.errors.name}</div>}
                            <button type="submit" className='searchbar-submit'>Search</button>
                        </form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default SearchBar;