import { PropTypes } from 'prop-types';
import { useMap } from '@vis.gl/react-google-maps';
import { Button } from '../../Common';

import { SELECTED_VIEW } from '../../../constants';

const propTypes = {
    currentSearchQuery: PropTypes.string.isRequired,
    updateSearchQuery: PropTypes.func.isRequired,
    getRestaurants: PropTypes.func.isRequired,
    selectedView: PropTypes.string.isRequired,
};

const SearchInput = ({ getRestaurants, currentSearchQuery, updateSearchQuery, location, selectedView }) => {
    const map = useMap();

    return (
        <div className="my-2 flex w-full max-w-3xl flex-col gap-2 sm:flex-row">
            <input
                id="searchInput"
                name="search"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                placeholder="Search for a restaurant"
                value={currentSearchQuery}
                onChange={(event) => {
                    updateSearchQuery(event.target.value);
                }}
            />
            <Button
                className="w-full sm:w-auto"
                color='danger'
                onClick={(event) => {
                    let searchLocation;
                    if (map && selectedView === SELECTED_VIEW.MAP) {
                        const mapCenter = map.getCenter();
                        searchLocation = { latitude: mapCenter.lat(), longitude: mapCenter.lng() };
                    } else {
                        searchLocation = location;
                    }

                    getRestaurants(currentSearchQuery, searchLocation);
                }}
            >Submit</Button>
        </div>
    )
}

SearchInput.propTypes = propTypes;

export default SearchInput;
