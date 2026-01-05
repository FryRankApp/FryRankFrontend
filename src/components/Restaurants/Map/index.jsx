import React, { useCallback } from 'react';
import { PropTypes } from 'prop-types';
import {
  ControlPosition,
  InfoWindow,
  Map as GoogleMap,
  MapControl,
  useMap
} from '@vis.gl/react-google-maps';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Button } from 'reactstrap';
import { FrySpinner, Score } from '../../Common';
import { PATH_RESTAURANT_REVIEWS, PATH_VARIABLE_RESTAURANT_ID } from '../../../constants';
import MapPins from '../MapPins';
import { getDistance } from './helpers';

const propTypes = {
    showInfoWindow: PropTypes.bool.isRequired,
    setShowInfoWindow: PropTypes.func.isRequired,
    setInfoWindowProps: PropTypes.func.isRequired,
    infoWindowProps: PropTypes.func.isRequired,
    aggregateReviewsData: PropTypes.object.isRequired,
    pinData: PropTypes.object,
    getRestaurants: PropTypes.func.isRequired,
    shouldAdjustBounds: PropTypes.bool.isRequired,
    currentSearchQuery: PropTypes.string.isRequired,
}

const Map = ({ showInfoWindow, setShowInfoWindow, setInfoWindowProps, infoWindowProps, aggregateReviewsData, pinData, showMapSearchButton,
               setShowMapSearchButton, getRestaurants, shouldAdjustBounds, currentSearchQuery }) => {

    const map = useMap();

    const adjustBounds = () => {
        const bounds = new google.maps.LatLngBounds();
        pinData.forEach(place => {
            bounds.extend({
                lat: place.location.lat,
                lng: place.location.lng
            });
        });
        map && map.fitBounds(bounds);
  }

  const handleClose = useCallback(() => setShowInfoWindow(false), []);

  const getRestaurantsForMapView = () => {
      const mapCenter = map.getCenter();
      const mapBounds = map.getBounds();

      const mapRadius = getDistance(
          mapCenter.lat(),
          mapBounds.getNorthEast().lng(),
          mapCenter.lat(),
          mapBounds.getSouthWest().lng()
      ) / 2;

      getRestaurants(currentSearchQuery, { latitude: mapCenter.lat(), longitude: mapCenter.lng() }, mapRadius);
  }

  return (
    <div className="w-full h-full">
        { !pinData
            ? <FrySpinner />
            : <>
                <GoogleMap
                    className='w-full h-full'
                    gestureHandling={'cooperative'}
                    disableDefaultUI={true}
                    maxZoom={18}
                    mapId={'ced49c98e3ab91a3'}
                    onCenterChanged={() => setShowMapSearchButton(true)}
                >
                    <MapPins
                        pinData = {pinData}
                        setShowInfoWindow = {setShowInfoWindow}
                        setInfoWindowProps = {setInfoWindowProps}
                    />
                    <MapControl position={ControlPosition.TOP_CENTER}>
                        { showMapSearchButton &&
                            <button 
                                className="bg-fry-orange hover:bg-fry-orange/90 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg my-2"
                                onClick={() => {
                                    getRestaurantsForMapView();
                                    setShowMapSearchButton(false);
                                }}
                            >
                                Search map area
                            </button>
                        }
                    </MapControl>
                </GoogleMap>
                {showInfoWindow &&
                    <InfoWindow
                        position={{ lat: infoWindowProps?.location.lat, lng: infoWindowProps?.location.lng }}
                        onCloseClick={handleClose}
                    >
                        <div className="p-3 min-w-[200px]">
                            <h6 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                <Link
                                    href={`${PATH_RESTAURANT_REVIEWS}`.replace(PATH_VARIABLE_RESTAURANT_ID, infoWindowProps?.id)}
                                    onClick={() => setShowInfoWindow(false)}
                                    className="text-fry-orange hover:text-fry-orange/80 transition-colors"
                                >
                                    {infoWindowProps?.name}
                                </Link>
                            </h6>
                            {infoWindowProps.score && (
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className={`w-4 h-4 ${
                                        infoWindowProps.score >= 4.5 ? 'text-green-500' :
                                        infoWindowProps.score >= 3.5 ? 'text-yellow-500' :
                                        infoWindowProps.score >= 2.5 ? 'text-orange-500' :
                                        'text-red-500'
                                    } fill-current`} />
                                    <span className={`font-semibold ${
                                        infoWindowProps.score >= 4.5 ? 'text-green-500' :
                                        infoWindowProps.score >= 3.5 ? 'text-yellow-500' :
                                        infoWindowProps.score >= 2.5 ? 'text-orange-500' :
                                        'text-red-500'
                                    }`}>
                                        {infoWindowProps.score?.toFixed(1)}
                                    </span>
                                </div>
                            )}
                            <p className="text-sm text-gray-600 dark:text-gray-400">{infoWindowProps?.address}</p>
                        </div>
                    </InfoWindow>
                }
                {pinData.length > 0 && !showInfoWindow && shouldAdjustBounds && adjustBounds()}
            </>
        }
    </div>
  );
};

Map.propTypes = propTypes;

export default Map;