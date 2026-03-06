export const types = {
    PUT_USER_SETTINGS_REQUEST: "PUT_USER_SETTINGS_REQUEST",
    PUT_USER_SETTINGS_SUCCESS: "PUT_USER_SETTINGS_SUCCESS",
    PUT_USER_SETTINGS_FAILURE: "PUT_USER_SETTINGS_FAILURE",
    SET_USER_SETTINGS_REQUEST: "SET_USER_SETTINGS_REQUEST",
    SET_USER_SETTINGS_SUCCESS: "SET_USER_SETTINGS_SUCCESS",
    SET_USER_SETTINGS_FAILURE: "SET_USER_SETTINGS_FAILURE",
    UPDATE_CURRENT_USER_SETTINGS: "UPDATE_CURRENT_USER_SETTINGS",
    GET_OTHER_USER_SETTINGS_REQUEST: "GET_OTHER_USER_SETTINGS_REQUEST",
    GET_OTHER_USER_SETTINGS_SUCCESS: "GET_OTHER_USER_SETTINGS_SUCCESS",
    GET_OTHER_USER_SETTINGS_FAILURE: "GET_OTHER_USER_SETTINGS_FAILURE",
    RESET_OTHER_USER_SETTINGS: "RESET_OTHER_USER_SETTINGS"
}

export const initialState = {
    currentUserSettings: null,
    userSettings: null,
    otherUserSettings: null,
    error: '',
    successfulSetUserSettings: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.PUT_USER_SETTINGS_REQUEST: {
            return {
                ...state
            };
        }

        case types.PUT_USER_SETTINGS_SUCCESS: {
            return {
                ...state,
                userSettings: action.data,
                currentUserSettings: action.data,
                error: ''
            }
        }

        case types.PUT_USER_SETTINGS_FAILURE: {
            return {
                ...state,
                error: action.error
            }
        }

        case types.SET_USER_SETTINGS_REQUEST: {
            return {
                ...state
            };
        }

        case types.SET_USER_SETTINGS_SUCCESS: {
            return {
                ...state,
                userSettings: action.data,
                error: '',
                successfulSetUserSettings: 'Successfully updated user settings'
            }
        }

        case types.SET_USER_SETTINGS_FAILURE: {
            return {
                ...state,
                error: action.error
            }
        }

        case types.UPDATE_CURRENT_USER_SETTINGS: {
            return {
                ...state,
                currentUserSettings: {
                    ...state.currentUserSettings,
                    [action.name]: action.value !== "" ? action.value : null
                }
            }
        }

        case types.GET_OTHER_USER_SETTINGS_REQUEST: {
            return {
                ...state
            };
        }

        case types.GET_OTHER_USER_SETTINGS_SUCCESS: {
            return {
                ...state,
                otherUserSettings: action.data,
                error: ''
            }
        }

        case types.GET_OTHER_USER_SETTINGS_FAILURE: {
            return {
                ...state,
                error: action.error
            }
        }

        case types.RESET_OTHER_USER_SETTINGS: {
            return {
                ...state,
                otherUserSettings: initialState.otherUserSettings
            }
        }

        default:
            return state;
    }
}

export const userSettingsActions = {
    startPutUserSettingsRequest: (accountId, defaultUsername, idToken) => ({ type: types.PUT_USER_SETTINGS_REQUEST, accountId, defaultUsername, idToken }),
    successfulPutUserSettingsRequest: data => ({ type: types.PUT_USER_SETTINGS_SUCCESS, data }),
    failedPutUserSettingsRequest: error => ({ type: types.PUT_USER_SETTINGS_FAILURE, error }),
    startSetUserSettingsRequest: (userSettings, idToken) => ({ type: types.SET_USER_SETTINGS_REQUEST, userSettings, idToken }),
    successfulSetUserSettingsRequest: data => ({ type: types.SET_USER_SETTINGS_SUCCESS, data }),
    failedSetUserSettingsRequest: error => ({ type:types.SET_USER_SETTINGS_FAILURE, error }),
    updateCurrentUserSettings: (name, value) => ({ type:types.UPDATE_CURRENT_USER_SETTINGS, name, value }),
    startGetOtherUserSettingsRequest: (accountId) => ({ type: types.GET_OTHER_USER_SETTINGS_REQUEST, accountId }),
    successfulGetOtherUserSettingsRequest: data => ({ type: types.GET_OTHER_USER_SETTINGS_SUCCESS, data }),
    failedGetOtherUserSettingsRequest: error => ({ type: types.GET_OTHER_USER_SETTINGS_FAILURE, error }),
    resetOtherUserSettings: () => ({ type: types.RESET_OTHER_USER_SETTINGS })
}