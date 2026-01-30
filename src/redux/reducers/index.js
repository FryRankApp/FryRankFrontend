import { combineReducers } from 'redux';
import restaurantsReducer from './restaurants';
import reviewsReducer from './reviews';
import userReducer from './user';
import userSettingsReducer from "./userSettings";

export default combineReducers({
    reviewsReducer,
    restaurantsReducer,
    userReducer,
    userSettingsReducer,
});


