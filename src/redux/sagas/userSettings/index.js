import { put, takeEvery, call } from 'redux-saga/effects'
import axios from 'axios';
import {BACKEND_SERVICE_PATH} from "../../../constants";
import {types, userSettingsActions} from "../../reducers/userSettings";
import { generateToken } from "../../../utils/";

const API_PATH = `${BACKEND_SERVICE_PATH}/userMetadata`

export function* callPutUserSettings({ accountId, defaultUsername }){
    try {
        const token = yield call(generateToken, accountId);
        const { data } = yield axios.put(API_PATH, { }, { params: { accountId: token, defaultUsername: defaultUsername } });
        yield put(userSettingsActions.successfulPutUserSettingsRequest(data));
    } catch (err) {
        yield put(userSettingsActions.failedPutUserSettingsRequest(err.response.data.message));
    }
}

export function* callGetUserSettings({ accountId }){
    try {
        const token = yield call(generateToken, accountId);
        const { data } = yield axios.get(API_PATH, { params: { accountId: token } });
        yield put(userSettingsActions.successfulGetOtherUserSettingsRequest(data));
    } catch (err) {
        yield put(userSettingsActions.failedGetOtherUserSettingsRequest(err.response.data.message));
    }
}

export function* callSetUserSettings({ userSettings }){
    const token = yield call(generateToken, userSettings.accountId);
    const updatedUserSettings = {
        ...userSettings,
        accountId: token
    };

    try {
        const { data } = yield axios.post(API_PATH, updatedUserSettings);
        yield put(userSettingsActions.successfulSetUserSettingsRequest(data));
    } catch (err) {
        yield put(userSettingsActions.failedSetUserSettingsRequest(err.response.data.message));
    }
}

export default function* watchUserSettingsRequest() {
    yield takeEvery(types.PUT_USER_SETTINGS_REQUEST, callPutUserSettings);
    yield takeEvery(types.SET_USER_SETTINGS_REQUEST, callSetUserSettings);
    yield takeEvery(types.GET_OTHER_USER_SETTINGS_REQUEST, callGetUserSettings);
}