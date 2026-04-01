import { useEffect, useRef } from 'react';
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
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!sentinelRef.current || !nextCursor || requestingReviews) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                getReviews(accountId, nextCursor);
            }
        });

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [nextCursor, requestingReviews, accountId, getReviews]);

    const reviewsBody = () => {
        if (!reviews) {
            return <FrySpinner />;
        } else if (reviews.length === 0) {
            return <p>Sorry, this critic has not yet published a review.</p>
        } else {
            return (
                <>
                    <ReviewCardList
                        reviews={reviews}
                        currentRestaurants={currentRestaurants}
                    />
                    {requestingReviews && <FrySpinner />}
                    {nextCursor
                        ? <div ref={sentinelRef} />
                        : <p style={{textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold'}}>End of reviews.</p>
                    }
                </>
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
