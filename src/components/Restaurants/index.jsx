import { PropTypes } from 'prop-types';
import { Breadcrumb, Banner } from '../Common';
import SearchInput from './SearchInput';
import RestaurantsViewSelect from './RestaurantsViewSelect';
import Map from './Map';
import RestaurantsList from './RestaurantsList';
import { SELECTED_VIEW } from '../../constants';

const propTypes = {
    restaurantIdsForQuery: PropTypes.array.isRequired,
    currentRestaurants: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired,
    getRestaurants: PropTypes.func.isRequired,
    currentSearchQuery: PropTypes.string.isRequired,
    updateSearchQuery: PropTypes.func.isRequired,
    location: PropTypes.object,
    aggregateReviewsData: PropTypes.object.isRequired,
    showInfoWindow: PropTypes.bool.isRequired,
    setShowInfoWindow: PropTypes.func.isRequired,
    shouldAdjustBounds: PropTypes.bool.isRequired,
}

const Restaurants = ({ restaurantIdsForQuery, error, getRestaurants, currentSearchQuery, updateSearchQuery, location, aggregateReviewsData,
                       currentRestaurants, setSelectedView, selectedView, showInfoWindow, setShowInfoWindow, setInfoWindowProps, infoWindowProps,
                       pinData, showMapSearchButton, setShowMapSearchButton, requestingRestaurantsForQuery, shouldAdjustBounds
}) => {
    return (
        <section className="w-full max-w-5xl">
            <Banner type="error" message={error} />
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm sm:p-6">
                <Breadcrumb />
                <div className="mt-2">
                    <h1 className="text-3xl font-bold text-slate-900">Find Fry Spots Near You</h1>
                    <p className="mt-1 text-slate-600">Search by restaurant name and switch between map and list views instantly.</p>
                </div>
                <SearchInput
                    getRestaurants = {getRestaurants}
                    currentSearchQuery = {currentSearchQuery}
                    updateSearchQuery = {updateSearchQuery}
                    location = {location}
                    selectedView = {selectedView}
                />
                <RestaurantsViewSelect
                    selectedView = {selectedView}
                    setSelectedView = {setSelectedView}
                />
            </div>
            {selectedView === SELECTED_VIEW.MAP &&
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
                    <Map
                        showInfoWindow = {showInfoWindow}
                        setShowInfoWindow = {setShowInfoWindow}
                        setInfoWindowProps = {setInfoWindowProps}
                        infoWindowProps = {infoWindowProps}
                        aggregateReviewsData = {aggregateReviewsData}
                        pinData = {pinData}
                        showMapSearchButton = {showMapSearchButton}
                        setShowMapSearchButton = {setShowMapSearchButton}
                        getRestaurants = {getRestaurants}
                        shouldAdjustBounds = {shouldAdjustBounds}
                        currentSearchQuery = {currentSearchQuery}
                    />
                </div>
            }
            {selectedView === SELECTED_VIEW.LIST &&
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <RestaurantsList
                        restaurantIds = {restaurantIdsForQuery}
                        currentRestaurants = {currentRestaurants}
                        aggregateReviewsData = {aggregateReviewsData}
                    />
                </div>
            }
        </section>
    );
}

Restaurants.propTypes = propTypes;

export default Restaurants;
