import { PropTypes } from 'prop-types';

const propTypes = {
    score: PropTypes.number.isRequired,
    size: PropTypes.oneOf([
        'lg',
        'md',
        'sm'
    ])
}

const Score = ({score, size}) => {
    const styleBySize = {
        lg: "h-14 w-14 text-2xl",
        md: "h-9 w-9 text-lg",
        sm: "h-8 w-8 text-sm"
    };

    return (
        <span className={`ml-2 inline-flex items-center justify-center rounded-full border-2 border-red-500 bg-white font-bold text-red-600 shadow-sm ${styleBySize[size]}`}>
            {score}
        </span>
    );
}

Score.defaultProps = {
    size: 'lg',
}

Score.propTypes = propTypes;

export default Score;
