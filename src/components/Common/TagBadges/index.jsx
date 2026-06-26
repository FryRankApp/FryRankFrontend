import { memo } from 'react';
import { PropTypes } from 'prop-types';

const propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string,
};

const TagBadges = memo(({ tags, className = '' }) => {
    if (!tags || tags.length === 0) return null;
    return (
        <div className={`flex flex-wrap gap-1 ${className}`}>
            {tags.map(tag => (
                <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
});

TagBadges.propTypes = propTypes;

export default TagBadges;
