import { PropTypes } from 'prop-types';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FrySpinner, Score } from '../../Common';
import { PATH_RESTAURANT_REVIEWS, PATH_VARIABLE_RESTAURANT_ID } from '../../../constants.js';

const propTypes = {
    restaurantIds: PropTypes.array,
    currentRestaurants: PropTypes.object,
    aggregateReviewsData: PropTypes.object
}

const RestaurantsList = ({ restaurantIds, currentRestaurants, aggregateReviewsData }) => {
    const restaurants = restaurantIds && currentRestaurants
        ? Array.from(currentRestaurants.values()).filter(restaurant => restaurantIds.includes(restaurant.id))
        : null;

    if (restaurants && restaurants.length > 0) {
        return <div className="grid gap-3">{restaurants.map((restaurant, i) => {
            let restaurantLink = `${PATH_RESTAURANT_REVIEWS}`.replace(PATH_VARIABLE_RESTAURANT_ID, restaurant.id)
            return (
                <Fragment key = {i}>
                    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-red-300 hover:bg-white">
                    <p className="inline-paragraph text-lg font-bold"><Link to={restaurantLink}>{restaurant.displayName.text}</Link></p>
                    {aggregateReviewsData[restaurant.id] && <Score size="sm" score={aggregateReviewsData[restaurant.id].avgScore} />}
                    <p className="mt-1 text-sm text-slate-600">{restaurant.formattedAddress}</p>
                    </article>
                </Fragment>
            )})}</div>;
    } else if (restaurants && restaurants.length === 0) {
        return <p className="rounded-xl bg-slate-100 px-4 py-3 text-slate-700">No restaurants found for this search.</p>;
    } else {
        return <FrySpinner />;
    }
}

RestaurantsList.propTypes = propTypes;

export default RestaurantsList;
