import { PropTypes } from 'prop-types';
import { Button } from '../../Common';
import { SELECTED_VIEW } from '../../../constants';

const propTypes = {
    selectedView: PropTypes.string.isRequired,
    setSelectedView: PropTypes.func.isRequired,
}

const RestaurantsViewSelect = ({ selectedView, setSelectedView }) => {
    return (
        <div>
            <div className="my-2 inline-flex rounded-md border border-slate-300 p-1">
                <Button
                    color={selectedView === SELECTED_VIEW.MAP ? "primary" : "secondary"}
                    onClick={() => setSelectedView(SELECTED_VIEW.MAP)}
                >
                    Map
                </Button>
                <Button
                    color={selectedView === SELECTED_VIEW.LIST ? "primary" : "secondary"}
                    onClick={() => setSelectedView(SELECTED_VIEW.LIST)}
                >
                    List
                </Button>
            </div>
        </div>
    );
}

RestaurantsViewSelect.propTypes = propTypes;

export default RestaurantsViewSelect;
