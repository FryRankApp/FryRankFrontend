import { PropTypes } from 'prop-types';

const propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf([
        'error',
        'success'
    ])
};

const typeToProperties = {
    'error': {"bannerPrefix": "Error: ", "color": "danger"},
    'success': {"bannerPrefix": "", "color": "success"}
}

const Banner = ({message, type}) => {
    const bannerStyle = type === "error"
        ? "border-red-200 bg-red-100 text-red-800"
        : "border-emerald-200 bg-emerald-100 text-emerald-800";

    return message
        ? <div className={`mt-3 rounded-md border px-4 py-3 ${bannerStyle}`}>{typeToProperties[type].bannerPrefix}{message}</div>
        : null;
}

Banner.propTypes = propTypes;

export default Banner;
