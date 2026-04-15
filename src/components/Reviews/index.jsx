import { PropTypes } from 'prop-types';
import { Breadcrumb, Button, Banner, FrySpinner, LinkButton, RestaurantHeader, ReviewCardList } from '../Common';

const propTypes = {
    reviews: PropTypes.array.isRequired,
    nextCursor: PropTypes.string,
    reviewsError: PropTypes.string.isRequired,
    restaurantsError: PropTypes.string.isRequired,
    currentRestaurants: PropTypes.object.isRequired,
    averageScore: PropTypes.number.isRequired,
    requestingRestaurantDetails: PropTypes.bool.isRequired,
    requestingReviews: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    getReviews: PropTypes.func.isRequired,
};

const Reviews = ({ params: { restaurantId }, reviews, nextCursor, reviewsError, restaurantsError, currentRestaurants, requestingRestaurantDetails, requestingReviews, averageScore, loggedIn, getReviews }) => {
    const reviewsBody = () => {
        if (!reviews) {
            return <FrySpinner />;
        } else if (reviews.length === 0) {
            return <p>No reviews exist for this restaurant yet. Why don't you write the first one?</p>
        } else {
            return (
                <ReviewCardList
                    reviews={reviews}
                    nextCursor={nextCursor}
                    requestingReviews={requestingReviews}
                    onLoadMore={() => getReviews(restaurantId, nextCursor)}
                />
            )
        }
    }

    const currentRestaurant = currentRestaurants && currentRestaurants.size > 0
        ? currentRestaurants.get(restaurantId)
        : null;

    return (
        <div>
            <Banner type="error" message={reviewsError} />
            <Banner type="error" message={restaurantsError} />
            { requestingRestaurantDetails && <FrySpinner /> }
            { currentRestaurant &&
                <div>
                   <Breadcrumb aliases = {{[currentRestaurant.id]: currentRestaurant.displayName.text}}/>
                   <RestaurantHeader currentRestaurant={currentRestaurant} averageScore={averageScore} />
                   { loggedIn &&
                       <LinkButton
                           link={'/restaurants/' + currentRestaurant.id + '/create'}
                           children='Write a review'
                           color='danger'
                       />
                   }
                   { !loggedIn &&
                       <Button
                           children='Log in to Google to write a review'
                           color='danger'
                           disabled='true'
                       />
                   }
                   <LinkButton
                       link='/restaurants/'
                       children='Back to all restaurants'
                       color='secondary'
                   />
                   {reviewsBody()}
                </div> }
        </div>
    )
}

Reviews.propTypes = propTypes;

export default Reviews;
