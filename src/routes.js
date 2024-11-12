import Homepage from './components/Homepage';
import Restaurants from './containers/Restaurants';
import Reviews from './containers/Reviews';
import Critic from './containers/Critic';
import CreateReview from './containers/CreateReview';

import {
    PATH_HOME,
    PATH_RESTAURANTS,
    PATH_RESTAURANT_REVIEWS,
    PATH_ACCOUNT_REVIEWS,
    PATH_CREATE_REVIEW,
    PATH_RECENT_REVIEW
} from "./constants.js"

const routes = [
    { path: PATH_HOME, component: Homepage },
    { path: PATH_RESTAURANT_REVIEWS, component: Reviews },
    { path: PATH_ACCOUNT_REVIEWS, component: Critic },
    { path: PATH_CREATE_REVIEW, component: CreateReview },
    { path: PATH_RESTAURANTS, component: Restaurants },
    { path: PATH_RECENT_REVIEW, component: "" }
];

const pathToPageName = {
    [PATH_RESTAURANTS] : "Restaurants"
}

console.log(pathToPageName)

export { routes, pathToPageName }