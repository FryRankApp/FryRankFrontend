import { memo } from 'react';
import { PropTypes } from 'prop-types';
import { FRY_TAGS } from '../../../constants';

const propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    labelName: PropTypes.string,
    id: PropTypes.string,
};

const TagFilter = memo(({ value = '', onChange, labelName = "Filter by fry type", id = "tagFilter" }) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{labelName}</label>
            <select
                id={id}
                value={value || ''}
                onChange={(event) => onChange(event.target.value || null)}
                className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2"
            >
                <option value="">All fry types</option>
                {FRY_TAGS.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
        </div>
    );
});

TagFilter.propTypes = propTypes;

export default TagFilter;
