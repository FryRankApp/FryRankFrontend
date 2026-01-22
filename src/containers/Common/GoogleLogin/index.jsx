import { compose, lifecycle } from 'react-recompose';
import { connect } from 'react-redux';
import { GoogleLogin } from '../../../components/Common';
import { userActions } from '../../../redux/reducers/user';
import {userSettingsActions} from "../../../redux/reducers/userSettings";
import {getUsernameFromState} from "../utils";

const mapStateToProps = (state) => {
    return {
        loggedIn: state.userReducer.loggedIn,
        username: getUsernameFromState(state),
        accountId: state.userReducer.userData ? state.userReducer.userData.sub : null,
        userSettings: state.userSettingsReducer.userSettings ? state.userSettingsReducer.userSettings : null,
        defaultUsername: state.userReducer.userData ? state.userReducer.userData.given_name : null,
    }
}

const mapDispatchToProps = {
    setUserData: userActions.setUserData,
    setIdToken: userActions.setIdToken,
    putUserSettings: userSettingsActions.startPutUserSettingsRequest,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle({
        componentDidUpdate() {
            const { loggedIn, putUserSettings, userSettings, accountId, defaultUsername } = this.props;
            if(loggedIn && userSettings === null) {
                putUserSettings(accountId, defaultUsername);
            }
        }
    }),
)(GoogleLogin);