import React from 'react'


class SearchResultsView extends React.Component {

    render() {
        return (
            <div className="overlay" onClick={this.props.onEscape}>
                <div className="search-resutls" onClick={e => e.stopPropagation()} >
                    <ol>
                        {this.props.results.map(result =>
                            <li key={result.id} onClick={this.props.onViewPin(result.id)}>{result.title}</li>
                        )}
                    </ol>
                </div>
            </div>
        )
    }

}

export default SearchResultsView