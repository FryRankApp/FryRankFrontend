import {PropTypes} from "prop-types";
import {Form, FormGroup, Input, Label} from 'reactstrap'
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
                    <Form
                        onChange={(event) => {
                            updateCurrentUserSettings(event.target.name, event.target.value)
                        }}
                    >
                        <FormGroup>
                            <Label>Username</Label>
                            <Input name="username" defaultValue={userSettings.username}></Input>
                        </FormGroup>
                    </Form>
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

export default UserSettings;