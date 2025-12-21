import { PropTypes } from 'prop-types';

import { Breadcrumb, Banner, FrySpinner, RestaurantHeader } from '../Common/';
import ReviewForm from './ReviewForm';

const propTypes = {
    error: PropTypes.string.isRequired,
    currentRestaurant: PropTypes.object.isRequired,
    currentReview: PropTypes.object.isRequired,
    updateCurrentReview: PropTypes.func.isRequired,
    createReview: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
    formErrors: PropTypes.object.isRequired,
    setFormErrors: PropTypes.func.isRequired,
    deleteFormError: PropTypes.func.isRequired,
};

const CreateReview = ({ params: { restaurantId }, error, currentRestaurants, currentReview, updateCurrentReview, createReview, loggedIn, username, accountId, formErrors, setFormErrors, deleteFormError }) => {
    const currentRestaurant = currentRestaurants && currentRestaurants.size > 0
        ? currentRestaurants.get(restaurantId)
        : null;

    if (!currentRestaurant) {
        return <FrySpinner />;
    }

    return (
        <div>
            <Banner type="error" message={error} />
            <Breadcrumb aliases = {{[currentRestaurant.id]: currentRestaurant.displayName.text}} />
            <RestaurantHeader currentRestaurant = {currentRestaurant} />
            <ReviewForm
                createReview = {createReview}
                currentRestaurant = {currentRestaurant}
                currentReview = {currentReview}
                updateCurrentReview = {updateCurrentReview}
                loggedIn = {loggedIn}
                username = {username}
                accountId = {accountId}
                formErrors = {formErrors}
                setFormErrors = {setFormErrors}
                deleteFormError = {deleteFormError}
            />
        </div>
    )
}

CreateReview.propTypes = propTypes;

export default CreateReview;
