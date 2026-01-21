import React from 'react'
import "./spinner.css";

const FrySpinner = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-fry-orange border-t-transparent rounded-full animate-spin"></div>
            <p className="visually-hidden">Loading...</p>
        </div>
    )
}

export default FrySpinner;