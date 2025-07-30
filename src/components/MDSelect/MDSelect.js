// components/MDSelect.jsx
import React from 'react';
import MDTypography from '../MDTypography';

function MDSelect({ label, value, onChange, options, required }) {
    return (
        <div>
            <MDTypography variant="body1" mb={1}>
                {label}
            </MDTypography>
            <select
                value={value}
                onChange={onChange}
                required={required}
                style={{
                    padding: "12px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #d2d6da",
                    color: "#868ba3"
                }}
            >
                <option value="" disabled>
                    Select {label.toLowerCase()}
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default MDSelect;
