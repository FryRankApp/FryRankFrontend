import React from "react";
import { Link } from 'react-router-dom';

import {
    PATH_ACCOUNT_REVIEWS,
    PATH_VARIABLE_ACCOUNT_ID,
} from '../../../constants.js'
import '../style.css'

const GoogleLogin = ({ setUserData, loggedIn, username, accountId, setIdToken }) => {

    window.Google_signIn = async (response) => {
        const userData = decodeJwtResponse(response.credential);
        setUserData(userData);
        setIdToken(response.credential);
    }

    function decodeJwtResponse(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    }

    const scriptRef = React.useRef(null);
    React.useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        if (scriptRef.current) {
            scriptRef.current.appendChild(script);
        }

        return () => {
            scriptRef.current?.removeChild(script);
        };
    }, [scriptRef]);

    return (
        <div>
            { loggedIn && username &&
                <div>
                    <p className="inline me-1 text-black">Hello,</p>
                    <Link
                        to={`${PATH_ACCOUNT_REVIEWS}`.replace(PATH_VARIABLE_ACCOUNT_ID, accountId)}
                        style={{"color":"blue", "text-decoration": "underline"}}
                    >
                        {username}
                    </Link>
                    <p className="inline text-black">!</p>
                </div> }
            { !loggedIn &&
                <>
                    <div ref={scriptRef}></div>

                    <div id="g_id_onload"
                         data-client_id={process.env.REACT_APP_GOOGLE_AUTH_KEY}
                         data-context="signin"
                         data-ux_mode="popup"
                         data-callback="Google_signIn"
                         data-auto_prompt="false">
                    </div>

                    <div className="flex flex-col items-center">
                        <div
                            className="g_id_signin"
                            data-type="standard"
                            data-size="large"
                            data-theme="outline"
                            data-text="continue_with"
                            data-shape="rectangular"
                            data-logo_alignment="center"
                        ></div>
                    </div>
                </>
            }
        </div>
    );
};

export default GoogleLogin;