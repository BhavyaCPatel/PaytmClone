import React from 'react';
import { Link } from 'react-router-dom';

const Form = ({ label, fields, handleSubmit, handleChange, formData }) => {
    const getFieldId = (field) => {
        switch (field.toLowerCase()) {
            case 'first name':
                return 'firstName';
            case 'last name':
                return 'lastName';
            case 'email':
                return 'email';
            case 'password':
                return 'password';
            default:
                return field.toLowerCase().replace(' ', '_');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit}>
                <div className="w-96 p-6 m-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="text-4xl text-center m-5 font-bold">{label}</div>
                    <div className="p-3">
                        {fields.map((field, index) => (
                            <div key={index} className="mb-4">
                                <label htmlFor={getFieldId(field)} className="block mb-2 text-sm font-medium text-gray-900">
                                    {field}
                                </label>
                                <input
                                    type={field.toLowerCase() === 'password' ? 'password' : 'text'}
                                    id={getFieldId(field)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm w-full rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                                    placeholder={`Enter ${field}`}
                                    value={formData[getFieldId(field)]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <div className="p-3">
                            <button
                                type="submit"
                                className="w-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            >
                                {label}
                            </button>
                        </div>
                    </div>
                    <div className="text-center">
                        {label === 'Sign Up' ? (
                            <Link to="/signin" className="text-black">
                                Already have an account? <u>Sign in</u>
                            </Link>
                        ) : (
                            <Link to="/signup" className="text-black">
                                Don&apos;t have an account? <u>Sign up</u>
                            </Link>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Form;
