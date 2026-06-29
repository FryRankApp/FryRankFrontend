import { useState, useEffect, useCallback } from 'react';
import { fetchRecentReviews, fetchRestaurantDetails } from '../../containers/RecentReviews';
import { useSelector, useDispatch } from 'react-redux';
import { FrySpinner, ReviewCardList, Banner, TagFilter } from '../Common';
import { reviewsActions } from '../../redux/reducers/reviews';

const RecentReviews = () => {
    const dispatch = useDispatch();
    const recentReviews = useSelector((state) => state.reviewsReducer.reviews);
    const selectedTag = useSelector((state) => state.reviewsReducer.tagFilter);
    const [restaurantData, setRestaurantData] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const reviews = await fetchRecentReviews(undefined, selectedTag);
            dispatch(reviewsActions.setReviews(reviews));
            setLoading(false);
        } catch (error) {
            setError(error.message);
        }
    }, [dispatch, selectedTag]);

    useEffect(() => {
        dispatch(reviewsActions.setTagFilter(null));
    }, [dispatch]);

    useEffect(()=>{
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        if (recentReviews) {
            const restaurantIds = Array.from(new Set(recentReviews.map(review => review.restaurantId)));
            const fetchDetails = async () => {
                const details = await fetchRestaurantDetails(restaurantIds);
                let restaurantDict = new Map();
                details.forEach(detail => {
                    restaurantDict.set(detail.id, detail);
                });

                setRestaurantData(restaurantDict);
                setLoading(false);
            };

            fetchDetails();
        }
    }, [recentReviews]);

    const onTagChange = (tag) => dispatch(reviewsActions.setTagFilter(tag));

    const body = () => {
        if (loading) {
            return <FrySpinner />;
        } else if (!recentReviews || recentReviews.length === 0) {
            return error
                ? <Banner type="error" message={error} />
                : <p>{selectedTag
                    ? `No recent reviews with the "${selectedTag}" tag yet.`
                    : "No recent reviews yet."}</p>;
        }
        return (
            <ReviewCardList
                reviews={recentReviews}
                currentRestaurants={restaurantData} // Pass the restaurantMap to the ReviewCardList
            />
        );
    };

    return (
        <section className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-6">
            <h1 className="mb-3 text-3xl font-bold text-slate-900">Recent Reviews</h1>
            <TagFilter value={selectedTag} onChange={onTagChange} />
            {body()}
        </section>
    );
};

export default RecentReviews;
