import { PropTypes } from 'prop-types';
import { FrySpinner } from '../../Common';

const propTypes = {
    message: PropTypes.string.isRequired,
};

const MessageCard = ({ message }) => {
    return (
        message && message.length > 0 ?
            <div className="my-2 inline w-full max-w-[80%] rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm">
                    {message}
            </div> : <FrySpinner className="spinner" />
    )
}

MessageCard.propTypes = propTypes;

export default MessageCard;
