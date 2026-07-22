import { call, put, takeEvery, takeLeading } from 'redux-saga/effects'
import axios from 'axios';
import {BACKEND_SERVICE_PATH} from "../../../constants";
import {types, userSettingsActions} from "../../reducers/userSettings";

const API_PATH = `${BACKEND_SERVICE_PATH}/userMetadata`

// Seeds user metadata on login: only PUTs the Google default username when no record exists yet.
// The backend GET returns 200 with no username field for a missing record, so absence is
// detected by the missing field rather than a 404.
export function* callInitializeUserSettings({ accountId, defaultUsername, idToken }){
    try {
        const { data } = yield axios.get(API_PATH, { params: { accountId: accountId } });
        if (data.username !== undefined) {
            yield put(userSettingsActions.successfulPutUserSettingsRequest(data));
            return;
        }
    } catch (err) {
        console.error('Failed to retrieve user settings:', err);
        yield put(userSettingsActions.failedPutUserSettingsRequest("ERROR: Could not retrieve username."));
        return;
    }
    // PUT the Google default username if no record exists yet.
    yield call(callPutUserSettings, { accountId, defaultUsername, idToken });
}

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
    // takeLeading (not the usual takeEvery): login fires componentDidUpdate several times before
    // userSettings populates, and "initialize once" should ignore the re-entrant dispatches.
    yield takeLeading(types.INITIALIZE_USER_SETTINGS_REQUEST, callInitializeUserSettings);
    yield takeEvery(types.PUT_USER_SETTINGS_REQUEST, callPutUserSettings);
    yield takeEvery(types.SET_USER_SETTINGS_REQUEST, callSetUserSettings);
    yield takeEvery(types.GET_OTHER_USER_SETTINGS_REQUEST, callGetUserSettings);
}