import React from 'react'


class SearchBar extends React.Component {

    render() {
        return (
            <div className="searchbar">
                <input type="text" placeholder="Search" className='searchbar-input' />
            </div>
        )
    }
}

export default SearchBar;