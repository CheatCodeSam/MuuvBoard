import React from 'react'
import { Formik } from 'formik';


class PinEditor extends React.Component {

    constructor(props) {
        super(props)
    }


    render() {
        return (
            <div className="pin-editor" onClick={this.props.onEscape}>
                <div className="pin-editor-form" onClick={e => e.stopPropagation()} >


                    <Formik
                        initialValues={{ image: null }}
                    >
                        {({ values, handleSubmit, setFieldValue, handleChange }) => (
                            <form onSubmit={handleSubmit}>
                                <div className='form-group'>
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
                                    <input id="file" name="file" type="file" onChange={(event) => {
                                        setFieldValue("file", event.currentTarget.files[0]);
                                    }} className="form-control" />
                                </div>
                                <button type="submit" >submit</button>
                            </form>
                        )}

                    </Formik>



                </div>
            </div>
        )
    }
}

export default PinEditor;