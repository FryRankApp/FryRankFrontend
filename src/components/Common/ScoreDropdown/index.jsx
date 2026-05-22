import React, { memo } from 'react';

const ScoreDropdown = memo(({name, id, labelName, value='', onChange = () => {}}) => {
    return (
        <div className="mb-3"> 
            <label htmlFor="scoreInput" className="mb-1 block text-sm font-medium text-slate-700">{labelName}</label> 
            <select
                type="select" 
                name={name}
                id={id}
                value={value}
                onChange={onChange} 
                className="w-full rounded-md border border-slate-300 px-3 py-2" 
            > 
                <option value="">Select a {name}</option> 
                <option value="10">10</option> 
                <option value="9">9</option> 
                <option value="8">8</option> 
                <option value="7">7</option> 
                <option value="6">6</option> 
                <option value="5">5</option> 
                <option value="4">4</option> 
                <option value="3">3</option> 
                <option value="2">2</option> 
                <option value="1">1</option> 
            </select> 
        </div>
    );
});

export default ScoreDropdown;
