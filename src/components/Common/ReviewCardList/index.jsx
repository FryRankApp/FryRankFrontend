import { PropTypes } from 'prop-types';
import { ReviewCard } from '../';

const propTypes = {
    reviews: PropTypes.array.isRequired,
    currentRestaurants: PropTypes.object,
};

const ReviewCardList = ({ reviews, currentRestaurants }) => {
    const getRestaurant = (restaurantId) => {
        if (!currentRestaurants) return null;
        
        // Handle Map (Redux version) or plain object (Next.js version)
        if (typeof currentRestaurants.get === 'function') {
            return currentRestaurants.get(restaurantId);
        } else {
            return currentRestaurants[restaurantId];
        }
    };

    return (
        reviews?.map(review => (
            <ReviewCard
                review={review}
                restaurant={getRestaurant(review.restaurantId)}
            />
        )).sort((a,b) => {
            // We declare the past for undefined values so that they sort to the end of the array.
            const past = new Date(0)
            let dateA = a.props.review.isoDateTime ? new Date(a.props.review.isoDateTime) : past
            let dateB = b.props.review.isoDateTime ? new Date(b.props.review.isoDateTime) : past
            return dateB.getTime() - dateA.getTime()
        })
    )
}

ReviewCardList.propTypes = propTypes;

export default ReviewCardList;