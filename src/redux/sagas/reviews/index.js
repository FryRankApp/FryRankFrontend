import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios';
import _ from 'lodash';

import { types, reviewsActions } from '../../reducers/reviews';
import { BACKEND_SERVICE_PATH, AGGREGATE_INFORMATION_API_PATH, REVIEW_PROPERTY_ISO_DATE_TIME } from '../../../constants';

const REVIEWS_API_PATH = `${BACKEND_SERVICE_PATH}/reviews`;
const REVIEWS_LIMIT = 10;

export function* callGetAllReviewsForRestaurant({ restaurantId, cursor }) {
    try {
        const params = { restaurantId, limit: REVIEWS_LIMIT };
        if (cursor) params.cursor = cursor;
        const { data } = yield axios.get(REVIEWS_API_PATH, { params });
        const aggregateReviewsData = yield axios.get(AGGREGATE_INFORMATION_API_PATH, { params: { ids: restaurantId, rating: true } });
        yield put(reviewsActions.successfulGetAllReviewsForRestaurantRequest(
            data,
            !_.isEmpty(aggregateReviewsData.data.restaurantIdToRestaurantInformation) ? aggregateReviewsData.data.restaurantIdToRestaurantInformation[restaurantId].avgScore : null,
            data.nextCursor ?? null,
        ));
    } catch (err) {
        yield put(reviewsActions.failedGetAllReviewsForRestaurantRequest(err.response.data.message));
    }
}

export function* callGetAllReviewsForAccount({ accountId, cursor }) {
    try {
        const params = { accountId, limit: REVIEWS_LIMIT };
        if (cursor) params.cursor = cursor;
        const { data } = yield axios.get(REVIEWS_API_PATH, { params });
        yield put(reviewsActions.successfulGetAllReviewsForAccountRequest(
            data,
            data.nextCursor ?? null,
        ));
    } catch (err) {
        yield put(reviewsActions.failedGetAllReviewsForAccountRequest(err.response.data.message));
    }
}

export function* callCreateReviewForRestaurant({ review, idToken }) {
    try {
        if (!idToken) {
            throw new Error('User not authenticated');
        }
        
        const config = {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        };
        
        yield axios.post(REVIEWS_API_PATH, review, config);
        yield put(reviewsActions.successfulCreateReviewForRestaurantRequest(review));
    } catch (err) {
        yield put(reviewsActions.failedCreateReviewForRestaurantRequest(err.response?.data?.message || err.message));
    }
}

export function* callDeleteReviewForRestaurantRequest( {reviewId, idToken} ){
    try{
        if(!idToken) {
            throw new Error('User not authenticated');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        };

        yield axios.delete(REVIEWS_API_PATH, { ...config, data: { reviewId } });
        yield put(reviewsActions.successfulDeleteReviewForRestaurantRequest(reviewId))
    } catch (err) {
        yield put(reviewsActions.failedDeleteReviewForRestaurantRequest(err.response.data.message));
    }
}

export default function* watchReviewsRequest() {
    yield takeEvery(types.GET_RESTAURANT_REVIEWS_REQUEST, callGetAllReviewsForRestaurant);
    yield takeEvery(types.GET_ACCOUNT_REVIEWS_REQUEST, callGetAllReviewsForAccount);
    yield takeEvery(types.CREATE_REVIEW_FOR_RESTAURANT_REQUEST, callCreateReviewForRestaurant);
    yield takeEvery(types.DELETE_REVIEW_FOR_RESTAURANT_REQUEST, callDeleteReviewForRestaurantRequest);
}