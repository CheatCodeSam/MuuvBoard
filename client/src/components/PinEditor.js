import React from "react"
import { Formik } from "formik"
import { WithContext as ReactTags } from "react-tag-input"

class PinEditor extends React.Component {
    constructor(props) {
        super(props)
        this.state = { tags: [] }
    }

    onSubmit = values => {
        const pin = {
            x_coordinate: this.props.x,
            y_coordinate: this.props.y,
            title: values.title,
            image: values.file,
            tags: this.state.tags.map(tag => tag.id),
        }
        this.props.onPinCreate(pin)
        this.props.onEscape()
    }

    handleDelete = i => {
        this.setState({
            tags: this.state.tags.filter((tag, index) => index !== i),
        })
    }

    handleAddition = tag => {
        this.setState({ tags: [...this.state.tags, tag] })
    }

    render() {
        return (
            <div className="old-overlay" onClick={this.props.onEscape}>
                <div
                    className="pin-editor-form"
                    onClick={e => e.stopPropagation()}
                >
                    <Formik
                        initialValues={{ file: null, tags: [] }}
                        onSubmit={this.onSubmit}
                    >
                        {({
                            values,
                            handleSubmit,
                            setFieldValue,
                            handleChange,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        onChange={handleChange}
                                        value={values.title}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="file">File upload</label>
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        multiple
                                        accept={
                                            "image/jpeg,image/png,image/webp"
                                        }
                                        onChange={event => {
                                            setFieldValue(
                                                "file",
                                                event.currentTarget.files
                                            )
                                        }}
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group">
                                    <ReactTags
                                        name="tags"
                                        tags={this.state.tags}
                                        handleDelete={this.handleDelete}
                                        handleAddition={this.handleAddition}
                                        value={values.tags}
                                    />
                                </div>
                                <button type="submit">submit</button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }
}

export default PinEditor
