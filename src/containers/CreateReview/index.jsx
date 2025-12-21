import { compose, lifecycle } from 'react-recompose';
import { connect } from 'react-redux';
import CreateReview from '../../components/CreateReview';
import { reviewsActions } from '../../redux/reducers/reviews';
import { restaurantsActions } from '../../redux/reducers/restaurants';
import withRouter from '../Common/withRouter';
import {getUsernameFromState} from "../Common/utils";

const mapStateToProps = (state) => {
    return {
        currentRestaurants: state.restaurantsReducer.currentRestaurants,
        error: state.reviewsReducer.error,
        currentReview: state.reviewsReducer.currentReview,
        successfulCreate: state.reviewsReducer.successfulCreate,
        formErrors: state.reviewsReducer.formErrors,
        loggedIn: state.userReducer.loggedIn,
        username: getUsernameFromState(state),
        accountId: state.userReducer.userData ? state.userReducer.userData.sub : null,
    }
}

const mapDispatchToProps = {
    getRestaurantsForIds: restaurantsActions.startGetRestaurantsForIdsRequest,
    createReview: reviewsActions.startCreateReviewForRestaurantRequest,
    updateCurrentReview: reviewsActions.updateCurrentReview,
    resetCreateRequest: reviewsActions.resetCreateRequest,
    setFormErrors: reviewsActions.setFormErrors,
    deleteFormError: reviewsActions.deleteFormError,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentDidMount() {
            const { params: { restaurantId }, getRestaurantsForIds, updateCurrentReview, resetCreateRequest, currentRestaurants } = this.props;
            resetCreateRequest();
            if (!currentRestaurants || !currentRestaurants.has(restaurantId)) {
                getRestaurantsForIds([restaurantId]);
            }
            updateCurrentReview("restaurantId", restaurantId);
        },
        componentDidUpdate() {
            const { params: { restaurantId }, successfulCreate, navigate } = this.props;
            if (successfulCreate) {
                navigate(`/restaurants/${restaurantId}`);
            }
        },
    }),
)(CreateReview);