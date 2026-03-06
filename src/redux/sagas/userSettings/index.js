import { put, takeEvery } from 'redux-saga/effects'
import axios from 'axios';
import {BACKEND_SERVICE_PATH} from "../../../constants";
import {types, userSettingsActions} from "../../reducers/userSettings";

const API_PATH = `${BACKEND_SERVICE_PATH}/userMetadata`

export function* callPutUserSettings({ accountId, defaultUsername, idToken }){
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
        
        const { data } = yield axios.put(API_PATH, {  }, { params: { accountId: accountId, defaultUsername: defaultUsername }, headers: config.headers });
        yield put(userSettingsActions.successfulPutUserSettingsRequest(data));
    } catch (err) {
        yield put(userSettingsActions.failedPutUserSettingsRequest(err.response?.data?.message || err.message));
    }
}

export function* callGetUserSettings({ accountId }){
    try {
        const { data } = yield axios.get(API_PATH, { params: { accountId: accountId } });
        yield put(userSettingsActions.successfulGetOtherUserSettingsRequest(data));
    } catch (err) {
        yield put(userSettingsActions.failedGetOtherUserSettingsRequest(err.response.data.message));
    }
}

export function* callSetUserSettings({ userSettings, idToken }){
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
        
        const { data } = yield axios.post(API_PATH, userSettings, config);
        yield put(userSettingsActions.successfulSetUserSettingsRequest(data));
    } catch (err) {
        yield put(userSettingsActions.failedSetUserSettingsRequest(err.response?.data?.message || err.message));
    }
}

export default function* watchUserSettingsRequest() {
    yield takeEvery(types.PUT_USER_SETTINGS_REQUEST, callPutUserSettings);
    yield takeEvery(types.SET_USER_SETTINGS_REQUEST, callSetUserSettings);
    yield takeEvery(types.GET_OTHER_USER_SETTINGS_REQUEST, callGetUserSettings);
}