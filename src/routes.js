import Homepage from './components/Homepage';
import Restaurants from './containers/Restaurants';
import Reviews from './containers/Reviews';
import Critic from './containers/Critic';
import CreateReview from './containers/CreateReview';
import RecentReviews from './components/RecentReviews';

import {
    PATH_HOME,
    PATH_RESTAURANTS,
    PATH_RESTAURANT_REVIEWS,
    PATH_ACCOUNT_REVIEWS,
    PATH_CREATE_REVIEW,
    PATH_RECENT_REVIEW,
    PATH_USER_SETTINGS
} from "./constants.js"
import UserSettings from './containers/UserSettings'

const routes = [
    { path: PATH_HOME, component: Homepage },
    { path: PATH_RESTAURANT_REVIEWS, component: Reviews },
    { path: PATH_ACCOUNT_REVIEWS, component: Critic },
    { path: PATH_CREATE_REVIEW, component: CreateReview },
    { path: PATH_RESTAURANTS, component: Restaurants },
    { path: PATH_RECENT_REVIEW, component: RecentReviews },
    { path: PATH_USER_SETTINGS, component: UserSettings},
];

const pathToPageName = {
    [PATH_RESTAURANTS] : "Restaurants"
}

console.log(pathToPageName)

export { routes, pathToPageName }