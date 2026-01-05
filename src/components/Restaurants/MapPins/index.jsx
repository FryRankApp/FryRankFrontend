import {
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';

import { PropTypes } from 'prop-types';

const propTypes = {
    setShowInfoWindow: PropTypes.func.isRequired,
    pinData: PropTypes.object,
}

const MapPins = ({ pinData, setShowInfoWindow, setInfoWindowProps }) => {
    return (
      <>
        {pinData.map(place => (
          <AdvancedMarker
            key={place.key}
            position={place.location}
            onClick={() => {
                setShowInfoWindow(true);
                setInfoWindowProps({
                   name: place.name,
                   location: place.location,
                   address: place.address,
                   score: place.score,
                   id: place.key
                });
            }}>
            <Pin 
                background={place.score ? '#EF4444' : '#FF6B35'} 
                glyphColor={'#FFFFFF'} 
                borderColor={place.score ? '#DC2626' : '#E7D273'} 
            />
          </AdvancedMarker>
        ))}
      </>
    );
}

MapPins.propTypes = propTypes;

export default MapPins;