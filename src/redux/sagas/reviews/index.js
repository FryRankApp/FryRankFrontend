import { put, takeEvery, call } from 'redux-saga/effects'
import axios from 'axios';
import _ from 'lodash';

import { types, reviewsActions } from '../../reducers/reviews';
import { BACKEND_SERVICE_PATH, AGGREGATE_INFORMATION_API_PATH, REVIEW_PROPERTY_ISO_DATE_TIME } from '../../../constants';
import { generateToken } from "../../../utils/";

const REVIEWS_API_PATH = `${BACKEND_SERVICE_PATH}/reviews`;

export function* callGetAllReviewsForRestaurant({ restaurantId }) {
    try {
        const { data } = yield axios.get(REVIEWS_API_PATH, { params: { restaurantId } });
        const aggregateReviewsData = yield axios.get(AGGREGATE_INFORMATION_API_PATH, { params: { ids: restaurantId, rating: true } });
        yield put(reviewsActions.successfulGetAllReviewsForRestaurantRequest(data, !_.isEmpty(aggregateReviewsData.data.restaurantIdToRestaurantInformation) ? aggregateReviewsData.data.restaurantIdToRestaurantInformation[restaurantId].avgScore : null));
    } catch (err) {
        yield put(reviewsActions.failedGetAllReviewsForRestaurantRequest(err.response.data.message));
    }
}

export function* callGetAllReviewsForAccount({ accountId }) {
    try {
        const token = yield call(generateToken, accountId);
        const { data } = yield axios.get(REVIEWS_API_PATH, { params: { accountId: token } });
        yield put(reviewsActions.successfulGetAllReviewsForAccountRequest(data));
    } catch (err) {
        yield put(reviewsActions.failedGetAllReviewsForAccountRequest(err.response.data.message));
    }
}

export function* callCreateReviewForRestaurant({ review }) {
    try {
        const token = yield call(generateToken, review.accountId);
        review = {
            ...review,
            [REVIEW_PROPERTY_ISO_DATE_TIME]: new Date().toISOString(),
        };
        yield axios.post(REVIEWS_API_PATH, review,  {
            headers: {
                'Authorization': `Bearer ${token}`,  // Send JWT separately for authentication
            }});
        yield put(reviewsActions.successfulCreateReviewForRestaurantRequest(review));
    } catch (err) {
        yield put(reviewsActions.failedCreateReviewForRestaurantRequest(err.response.data.message));
    }
}

export default function* watchReviewsRequest() {
    yield takeEvery(types.GET_RESTAURANT_REVIEWS_REQUEST, callGetAllReviewsForRestaurant);
    yield takeEvery(types.GET_ACCOUNT_REVIEWS_REQUEST, callGetAllReviewsForAccount);
    yield takeEvery(types.CREATE_REVIEW_FOR_RESTAURANT_REQUEST, callCreateReviewForRestaurant);
}