import { memo } from 'react';
import { PropTypes } from 'prop-types';
import { FRY_TAGS } from '../../../constants';

const propTypes = {
    selectedTags: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
    labelName: PropTypes.string,
    error: PropTypes.string,
};

const TagSelector = memo(({ selectedTags = [], onChange, labelName = "Fry type tags", error }) => {
    const toggleTag = (tag) => {
        const next = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        onChange(next);
    };

    return (
        <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-slate-700">{labelName}</label>
            <div className={`flex flex-wrap gap-2 rounded-md border p-2 ${error ? "border-red-500" : "border-slate-300"}`}>
                {FRY_TAGS.map(tag => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            aria-pressed={isSelected}
                            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                                isSelected
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                            }`}
                        >
                            {tag}
                        </button>
                    );
                })}
            </div>
            {error && <p className="text-red-600">{error}</p>}
        </div>
    );
});

TagSelector.propTypes = propTypes;

export default TagSelector;
