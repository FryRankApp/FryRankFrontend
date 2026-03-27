import { compose, lifecycle } from 'react-recompose';
import { connect } from 'react-redux';
import Reviews from '../../components/Reviews';
import { reviewsActions } from '../../redux/reducers/reviews';
import { restaurantsActions } from '../../redux/reducers/restaurants';
import withRouter from '../Common/withRouter';

const mapStateToProps = (state) => {
    return {
        reviews: state.reviewsReducer.reviews,
        nextCursor: state.reviewsReducer.nextCursor,
        averageScore: state.reviewsReducer.averageScore,
        currentRestaurants: state.restaurantsReducer.currentRestaurants,
        reviewsError: state.reviewsReducer.error,
        restaurantsError: state.restaurantsReducer.error,
        requestingRestaurantDetails: state.restaurantsReducer.requestingRestaurantDetails,
        requestingReviews: state.reviewsReducer.requestingReviews,
        loggedIn: state.userReducer.loggedIn,
    }
}

const mapDispatchToProps = {
    getRestaurantsForIds: restaurantsActions.startGetRestaurantsForIdsRequest,
    getReviews: reviewsActions.startGetAllReviewsForRestaurantRequest,
    resetCurrentRestaurant: restaurantsActions.resetCurrentRestaurant,
    resetReviews: reviewsActions.resetReviews
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentDidMount() {
            const { params: { restaurantId }, currentRestaurants, getRestaurantsForIds, getReviews, resetReviews } = this.props;
            resetReviews();
            if (!currentRestaurants || !currentRestaurants.has(restaurantId)) {
                getRestaurantsForIds([restaurantId]);
            }
            getReviews(restaurantId);
        },
    }),
)(Reviews);