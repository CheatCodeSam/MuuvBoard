import React from "react"

class SearchResultsView extends React.Component {
    render() {
        return (
            <div className="old-overlay" onClick={this.props.onEscape}>
                <div
                    className="search-resutls"
                    onClick={e => e.stopPropagation()}
                >
                    <ol>
                        {this.props.results.map(result => (
                            <li
                                key={result.id}
                                onClick={() => this.props.onPinView(result.id)}
                            >
                                {result.title}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchResultsView
