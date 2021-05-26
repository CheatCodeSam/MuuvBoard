import React from 'react';
import { Formik } from 'formik';
import axios from 'axios'

function CreatePin(props) {


    return (
        <>
            <Formik
                initialValues={{ image: null }}
                onSubmit={props.onSubmit}
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
                            <label for="file">File upload</label>
                            <input id="file" name="file" type="file" onChange={(event) => {
                                setFieldValue("file", event.currentTarget.files[0]);
                            }} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">submit</button>
                    </form>
                )}

            </Formik>
        </>
    )
};

export default CreatePin;