import {compose, lifecycle} from "react-recompose";
import {connect} from "react-redux";
import UserSettings from "../../components/UserSettings";
import { userSettingsActions } from "../../redux/reducers/userSettings";

const mapStateToProps = (state) => {
    const accountId = state.userReducer.userData ? state.userReducer.userData.sub : null;
    return {
        loggedIn: state.userReducer.loggedIn,
        accountId: accountId,
        userSettings: state.userSettingsReducer.userSettings ? state.userSettingsReducer.userSettings : null,
        currentUserSettings: state.userSettingsReducer.currentUserSettings ? {...state.userSettingsReducer.currentUserSettings, "accountId": accountId} : null,
        error: state.userSettingsReducer.error,
        successfulSetUserSettings: state.userSettingsReducer.successfulSetUserSettings,
        idToken: state.userReducer.idToken,
    }
}

const mapDispatchToProps = {
    putUserSettings: userSettingsActions.startPutUserSettingsRequest,
    setUserSettings: userSettingsActions.startSetUserSettingsRequest,
    updateCurrentUserSettings: userSettingsActions.updateCurrentUserSettings,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(UserSettings);