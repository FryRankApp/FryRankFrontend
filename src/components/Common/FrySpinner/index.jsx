import React from 'react'
import "./spinner.css";

const FrySpinner = () => {
    return (
        <div className="spinner h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500">
            <p className="sr-only">Loading...</p>
        </div>
    )
}

export default FrySpinner;
