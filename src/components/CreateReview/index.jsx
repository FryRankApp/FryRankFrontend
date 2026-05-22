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
    formErrors: PropTypes.object.isRequired,
    setFormErrors: PropTypes.func.isRequired,
    deleteFormError: PropTypes.func.isRequired,
};

const CreateReview = ({ params: { restaurantId }, error, currentRestaurants, currentReview, updateCurrentReview, createReview, loggedIn, username, formErrors, setFormErrors, deleteFormError, idToken }) => {
    const currentRestaurant = currentRestaurants && currentRestaurants.size > 0
        ? currentRestaurants.get(restaurantId)
        : null;

    if (!currentRestaurant) {
        return <FrySpinner />;
    }

    return (
        <section className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm sm:p-6">
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
                formErrors = {formErrors}
                setFormErrors = {setFormErrors}
                deleteFormError = {deleteFormError}
                idToken = {idToken}
            />
        </section>
    )
}

CreateReview.propTypes = propTypes;

export default CreateReview;
