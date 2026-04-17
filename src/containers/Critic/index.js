import { compose, lifecycle } from 'react-recompose';
import { connect } from 'react-redux';
import Critic from '../../components/Critic';
import { reviewsActions } from '../../redux/reducers/reviews';
import { restaurantsActions } from '../../redux/reducers/restaurants';
import withRouter from '../Common/withRouter';
import {getUsernameFromState} from "../Common/utils";
import {userSettingsActions} from "../../redux/reducers/userSettings";

const mapStateToProps = (state) => {
    return {
        reviews: state.reviewsReducer.reviews,
        nextCursor: state.reviewsReducer.nextCursor,
        requestingReviews: state.reviewsReducer.requestingReviews,
        reviewsError: state.reviewsReducer.error,
        loggedIn: state.userReducer.loggedIn,
        currentRestaurants: state.restaurantsReducer.currentRestaurants,
        restaurantsError: state.restaurantsReducer.restaurantsError,
        username: getUsernameFromState(state),
        otherUserSettings: state.userSettingsReducer.otherUserSettings,
    }
}

const mapDispatchToProps = {
    getReviews: reviewsActions.startGetAllReviewsForAccountRequest,
    resetReviews: reviewsActions.resetReviews,
    getRestaurantsForIds: restaurantsActions.startGetRestaurantsForIdsRequest,
    getOtherUserSettings: userSettingsActions.startGetOtherUserSettingsRequest,
    resetOtherUserSettings: userSettingsActions.resetOtherUserSettings,
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentDidMount() {
            const { params: { accountId }, getReviews, resetReviews, getOtherUserSettings, resetOtherUserSettings } = this.props;
            resetReviews();
            getReviews(accountId);
            resetOtherUserSettings();
            getOtherUserSettings(accountId);
        },
        componentDidUpdate(prevProps) {
            const { currentRestaurants, getRestaurantsForIds, reviews, params: { accountId }, getReviews, resetOtherUserSettings, getOtherUserSettings } = this.props;
            // The following code logic may run every time the state changes

            if (accountId !== prevProps.params.accountId) {
                getReviews(accountId);
                resetOtherUserSettings();
                getOtherUserSettings(accountId);
            }

            if (reviews) {
                const restaurantIds = Array.from(new Set(reviews.map(review => review.restaurantId)));
                if (!currentRestaurants || (currentRestaurants && currentRestaurants.size != restaurantIds.size)) {
                    const idsForRestaurantsToGetFromGoogle = currentRestaurants
                        ? restaurantIds.filter(restaurantId => !currentRestaurants.has(restaurantId))
                        : restaurantIds;
                    if (idsForRestaurantsToGetFromGoogle.length > 0) {
                        getRestaurantsForIds(idsForRestaurantsToGetFromGoogle);
                    }
                }
            }
        }
    }),
)(Critic);