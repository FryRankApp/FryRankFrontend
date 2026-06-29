import { PropTypes } from 'prop-types';
import { Breadcrumb, Button, Banner, FrySpinner, LinkButton, RestaurantHeader, ReviewCardList, TagFilter } from '../Common';

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
    selectedTag: PropTypes.string,
    onTagChange: PropTypes.func.isRequired,
};

const Reviews = ({ params: { restaurantId }, reviews, nextCursor, reviewsError, restaurantsError, currentRestaurants, requestingRestaurantDetails, requestingReviews, averageScore, loggedIn, getReviews, selectedTag, onTagChange }) => {
    const reviewsBody = () => {
        if (!reviews) {
            return <FrySpinner />;
        } else if (reviews.length === 0) {
            return <p>{selectedTag
                ? `No reviews with the "${selectedTag}" tag yet for this restaurant.`
                : "No reviews exist for this restaurant yet. Why don't you write the first one?"}</p>
        } else {
            return (
                <ReviewCardList
                    reviews={reviews}
                    nextCursor={nextCursor}
                    requestingReviews={requestingReviews}
                    onLoadMore={() => getReviews(restaurantId, nextCursor, selectedTag)}
                />
            )
        }
    }

    const currentRestaurant = currentRestaurants && currentRestaurants.size > 0
        ? currentRestaurants.get(restaurantId)
        : null;

    return (
        <section className="w-full max-w-4xl">
            <Banner type="error" message={reviewsError} />
            <Banner type="error" message={restaurantsError} />
            { requestingRestaurantDetails && <FrySpinner /> }
            { currentRestaurant &&
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-6">
                   <Breadcrumb aliases = {{[currentRestaurant.id]: currentRestaurant.displayName.text}}/>
                   <RestaurantHeader currentRestaurant={currentRestaurant} averageScore={averageScore} />
                   <div className="mt-2">
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
                   </div>
                   <TagFilter value={selectedTag} onChange={onTagChange} />
                   {reviewsBody()}
                </div> }
        </section>
    )
}

Reviews.propTypes = propTypes;

export default Reviews;
