import {PropTypes} from "prop-types";
import {Button, Banner} from "../Common";

const propTypes = {
    userSettings: PropTypes.shape({
        username: PropTypes.string
    }),
    currentUserSettings: PropTypes.shape({
        username: PropTypes.string,
        accountId: PropTypes.string
    }),
    loggedIn: PropTypes.bool.isRequired,
    setUserSettings: PropTypes.func.isRequired,
    updateCurrentUserSettings: PropTypes.func.isRequired,
    error: PropTypes.string,
    successfulSetUserSettings: PropTypes.string,
    idToken: PropTypes.string
}

const UserSettings = ({ userSettings, currentUserSettings, loggedIn, setUserSettings, updateCurrentUserSettings, error, successfulSetUserSettings, idToken }) => {
    return (
        <div>
        {
            !loggedIn &&
            <p> Please log in </p>
        }
        {
            loggedIn &&
            userSettings &&
                <div>
                    <Banner type="error" message={error} />
                    <Banner type="success" message={successfulSetUserSettings} />
                    <h2>Settings</h2>
                    <form
                        onChange={(event) => {
                            updateCurrentUserSettings(event.target.name, event.target.value)
                        }}
                    >
                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
                            <input className="w-full rounded-md border border-slate-300 px-3 py-2" name="username" defaultValue={userSettings.username}></input>
                        </div>
                    </form>
                    <Button children='Update'
                            color='danger'
                            onClick={(event) => {
                                setUserSettings(currentUserSettings, idToken)
                            }}
                    />
                </div>
        }
        </div>
    )
}

UserSettings.propTypes = propTypes;

export default UserSettings;
