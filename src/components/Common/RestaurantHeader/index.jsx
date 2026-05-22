import { PropTypes } from 'prop-types';
import { Score } from "../"

const propTypes = {
    currentRestaurant: PropTypes.object.isRequired,
    averageScore: PropTypes.number.isRequired,
};

const RestaurantHeader = ({ currentRestaurant, averageScore }) => {
    return (
        <div>
            <h1 className='inline-block text-3xl font-bold'>{currentRestaurant.displayName.text}</h1>
            {averageScore && (<Score score={averageScore} size="lg"/>)}
            <p>{currentRestaurant.formattedAddress}</p>
        </div>
    )
}

RestaurantHeader.propTypes = propTypes;

export default RestaurantHeader;
