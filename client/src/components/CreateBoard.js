import React from 'react';
import { Formik } from 'formik';
import axios from 'axios'



function CreateBoard(props) {

    return <Formik
        initialValues={{ image: null }}
        onSubmit={props.onSubmit}
    >
        {({ values, handleSubmit, handleChange }) => (
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
                <button type="submit" className="btn btn-primary">submit</button>
            </form>
        )}

    </Formik>

}

export default CreateBoard;