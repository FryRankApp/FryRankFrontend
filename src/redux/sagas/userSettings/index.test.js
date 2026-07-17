import { runSaga } from 'redux-saga';
import axios from 'axios';
import { callInitializeUserSettings } from './index';
import { types } from '../../reducers/userSettings';

jest.mock('axios', () => ({
    get: jest.fn(),
    put: jest.fn(),
}));

const action = { accountId: 'account-1', defaultUsername: 'GoogleGivenName', idToken: 'token-1' };

const runInitializeSaga = async () => {
    const dispatched = [];
    await runSaga({ dispatch: (dispatchedAction) => dispatched.push(dispatchedAction) }, callInitializeUserSettings, action).toPromise();
    return dispatched;
};

describe('callInitializeUserSettings', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('dispatches success with the existing record and skips the PUT when a username exists', async () => {
        axios.get.mockResolvedValue({ data: { username: 'ExistingName' } });

        const dispatched = await runInitializeSaga();

        expect(dispatched).toEqual([{ type: types.PUT_USER_SETTINGS_SUCCESS, data: { username: 'ExistingName' } }]);
        expect(axios.put).not.toHaveBeenCalled();
    });

    test('PUTs the default username when the GET response has no username field', async () => {
        axios.get.mockResolvedValue({ data: {} });
        axios.put.mockResolvedValue({ data: { username: 'GoogleGivenName' } });

        const dispatched = await runInitializeSaga();

        expect(axios.put).toHaveBeenCalledWith(
            expect.stringContaining('/userMetadata'),
            {},
            expect.objectContaining({ params: { accountId: 'account-1', defaultUsername: 'GoogleGivenName' } })
        );
        expect(dispatched).toEqual([{ type: types.PUT_USER_SETTINGS_SUCCESS, data: { username: 'GoogleGivenName' } }]);
    });

    test('dispatches failure and skips the PUT when the GET fails', async () => {
        axios.get.mockRejectedValue({ response: { data: 'Internal Server Error: boom' }, message: 'Request failed with status code 500' });

        const dispatched = await runInitializeSaga();

        expect(dispatched).toEqual([{ type: types.PUT_USER_SETTINGS_FAILURE, error: 'Internal Server Error: boom' }]);
        expect(axios.put).not.toHaveBeenCalled();
    });
});
