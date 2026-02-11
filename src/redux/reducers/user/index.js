export const types = {
    SET_USER_DATA: "SET_USER_DATA",
    SET_ID_TOKEN: "SET_ID_TOKEN",
}

export const initialState = {
    userData: null,
    loggedIn: false,
    idToken: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_USER_DATA: {
            return {
                ...state,
                userData: action.data,
                loggedIn: true,
            };
        }
        
        case types.SET_ID_TOKEN: {
            return {
                ...state,
                idToken: action.idToken,
            };
        }

        default:
            return state;
    }
}

export const userActions = {
    setUserData: data => ({ type: types.SET_USER_DATA, data }),
    setIdToken: idToken => ({ type: types.SET_ID_TOKEN, idToken })
}