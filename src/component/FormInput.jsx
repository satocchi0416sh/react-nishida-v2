import React from 'react'
import './Forminput_module.css'

// label, type, value, onChange
export const FormInput = ({ label, type, value, onChange }) => {

    return (
        <label className="inp">
            <input type={type} value={value} onChange={onChange} id="inp" placeholder="&nbsp;" />
            <span className="label">{label}</span>
            <span className="border"></span>
        </label>
    )
};
