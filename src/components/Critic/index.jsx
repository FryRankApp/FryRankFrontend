import { PropTypes } from 'prop-types';
import { Banner, FrySpinner, ReviewCardList } from '../Common';

const propTypes = {
    reviews: PropTypes.array.isRequired,
    nextCursor: PropTypes.string,
    reviewsError: PropTypes.string.isRequired,
    accountId: PropTypes.string.IsRequired,
    currentRestaurants: PropTypes.object.isRequired,
    requestingReviews: PropTypes.bool.isRequired,
    restaurantsError: PropTypes.bool.isRequired,
    getReviews: PropTypes.func.isRequired,
};

const Critic = ({ params: { accountId }, reviews, nextCursor, reviewsError, currentRestaurants, requestingReviews, restaurantsError, otherUserSettings, getReviews }) => {
    const reviewsBody = () => {
        if (!reviews) {
            return <FrySpinner />;
        } else if (reviews.length === 0) {
            return <p>Sorry, this critic has not yet published a review.</p>
        } else {
            return (
                <ReviewCardList
                    reviews={reviews}
                    currentRestaurants={currentRestaurants}
                    nextCursor={nextCursor}
                    requestingReviews={requestingReviews}
                    onLoadMore={() => getReviews(accountId, nextCursor)}
                />
            )
        }
    }

    const criticName = otherUserSettings && otherUserSettings.username ? otherUserSettings.username : accountId;

    return (
        <div>
            <Banner type="error" message = {reviewsError} />
            <Banner type="error" message = {restaurantsError} />
            { !requestingReviews && reviews && <h1>{criticName}'s Reviews</h1> }
            {reviewsBody()}
        </div>
    )
}

Critic.propTypes = propTypes;

export default Critic;
