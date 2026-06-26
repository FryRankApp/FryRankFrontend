import { useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';
import { FrySpinner, ReviewCard } from '../';

const propTypes = {
    reviews: PropTypes.array.isRequired,
    currentRestaurants: PropTypes.object,
    nextCursor: PropTypes.string,
    requestingReviews: PropTypes.bool,
    onLoadMore: PropTypes.func,
};

const ReviewCardList = ({ reviews, currentRestaurants, nextCursor, requestingReviews, onLoadMore }) => {
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!sentinelRef.current || !nextCursor || requestingReviews || !onLoadMore) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                onLoadMore();
            }
        }, { rootMargin: '200px' });

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [nextCursor, requestingReviews, onLoadMore]);

    const sorted = reviews?.map(review => (
        <ReviewCard
            key={`${review.reviewId}-${review.accountId || review.authorId || "anon"}`}
            review={review}
            restaurant={currentRestaurants ? currentRestaurants.get(review.restaurantId) : null}
        />
    )).sort((a, b) => {
        // We declare the past for undefined values so that they sort to the end of the array.
        const past = new Date(0);
        const dateA = a.props.review.isoDateTime ? new Date(a.props.review.isoDateTime) : past;
        const dateB = b.props.review.isoDateTime ? new Date(b.props.review.isoDateTime) : past;
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <>
            {sorted}
            {requestingReviews && <FrySpinner />}
            {onLoadMore && (nextCursor
                ? <div ref={sentinelRef} style={{ height: '1px' }} />
                : <p className="py-4 text-center text-base font-semibold text-slate-600">End of reviews.</p>
            )}
        </>
    );
};

ReviewCardList.propTypes = propTypes;

export default ReviewCardList;
