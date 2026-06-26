import { PropTypes } from 'prop-types';
import { Banner, FrySpinner, ReviewCardList, TagFilter } from '../Common';

const propTypes = {
    reviews: PropTypes.array.isRequired,
    nextCursor: PropTypes.string,
    reviewsError: PropTypes.string.isRequired,
    accountId: PropTypes.string.IsRequired,
    currentRestaurants: PropTypes.object.isRequired,
    requestingReviews: PropTypes.bool.isRequired,
    restaurantsError: PropTypes.bool.isRequired,
    getReviews: PropTypes.func.isRequired,
    selectedTag: PropTypes.string,
    onTagChange: PropTypes.func.isRequired,
};

const Critic = ({ params: { accountId }, reviews, nextCursor, reviewsError, currentRestaurants, requestingReviews, restaurantsError, otherUserSettings, getReviews, selectedTag, onTagChange }) => {
    const reviewsBody = () => {
        if (!reviews) {
            return <FrySpinner />;
        } else if (reviews.length === 0) {
            return <p>{selectedTag
                ? `This critic has no reviews with the "${selectedTag}" tag yet.`
                : "Sorry, this critic has not yet published a review."}</p>
        } else {
            return (
                <ReviewCardList
                    reviews={reviews}
                    currentRestaurants={currentRestaurants}
                    nextCursor={nextCursor}
                    requestingReviews={requestingReviews}
                    onLoadMore={() => getReviews(accountId, nextCursor, selectedTag)}
                />
            )
        }
    }

    const criticName = otherUserSettings && otherUserSettings.username ? otherUserSettings.username : accountId;

    return (
        <section className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-6">
            <Banner type="error" message = {reviewsError} />
            <Banner type="error" message = {restaurantsError} />
            { !requestingReviews && reviews && <h1 className="mb-3 text-3xl font-bold text-slate-900">{criticName}'s Reviews</h1> }
            <TagFilter value={selectedTag} onChange={onTagChange} />
            {reviewsBody()}
        </section>
    )
}

Critic.propTypes = propTypes;

export default Critic;
