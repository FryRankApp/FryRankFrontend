import { PropTypes } from 'prop-types';

import { Button, LinkButton, ScoreDropdown, validateReview } from '../../Common';
import FryposalLoginImage from "../../../Fryposal.png";
import './style.css';

const propTypes = {
    currentRestaurant: PropTypes.object.isRequired,
    currentReview: PropTypes.object.isRequired,
    updateCurrentReview: PropTypes.func.isRequired,
    createReview: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string.isRequired,
    formErrors: PropTypes.object.isRequired,
    setFormErrors: PropTypes.func.isRequired,
    deleteFormError: PropTypes.func.isRequired,
    idToken: PropTypes.string,
};

const ReviewForm = ({ createReview, currentRestaurant, currentReview, updateCurrentReview, loggedIn, username, formErrors, setFormErrors, deleteFormError, idToken }) => {

    const validateForm = () => {
        const newErrors = validateReview(currentReview);
        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateForm()) {
            createReview(currentReview, idToken);
        }
    };


    return (
        <div>
        <form
            onSubmit={handleSubmit}
            onChange={(event) => {
                updateCurrentReview(event.target.name, event.target.value);

                // Clear errors when user types in form fields.
                if (formErrors[event.target.name]) {
                    deleteFormError(event.target.name);
                }
            }}
        >
            {loggedIn &&
                <div><div className="mb-3">
                    <label htmlFor="nameInput" className="mb-1 block text-sm font-medium text-slate-700">
                        Name
                    </label>
                    <textarea
                        className="w-full rounded-md border border-slate-300 px-3 py-2"
                        id="nameInput"
                        name="authorId"
                        value={username}
                        type="textarea"
                        disabled
                    />
                </div>
                    <ScoreDropdown 
                        labelName="Score" 
                        name="score" 
                        id="scoreInput"
                        value={currentReview.score || ''}
                        onChange={(event) => {
                            updateCurrentReview(event.target.name, event.target.value);

                            // Clear errors when user types in form fields.
                            if (formErrors[event.target.name]) {
                                deleteFormError(event.target.name);
                            }
                        }}
                    />
                    {formErrors.score && <p className="text-red-600">{formErrors.score}</p>}
                    
                    <div className="mb-3">
                        <label htmlFor="titleInput" className="mb-1 block text-sm font-medium text-slate-700">
                            Title
                        </label>
                        <textarea
                            className={`w-full rounded-md border px-3 py-2 ${formErrors.title ? "border-red-500" : "border-slate-300"}`}
                            id="titleInput"
                            name="title"
                            value={currentReview.title || ''}
                            placeholder="A title for your review"
                        />
                    {formErrors.title && <p className="text-red-600">{formErrors.title}</p>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="bodyInput" className="mb-1 block text-sm font-medium text-slate-700">
                            Body
                        </label>
                        <textarea
                            className={`w-full rounded-md border px-3 py-2 ${formErrors.body ? "border-red-500" : "border-slate-300"}`}
                            id="bodyInput"
                            name="body"
                            value={currentReview.body || ''}
                            placeholder="Your review text here"
                        />
                    {formErrors.body && <p className="text-red-600">{formErrors.body}</p>}
                    </div></div>                
            }
            {loggedIn ? <Button
                children='Submit'
                color='danger'
                type='submit'
            /> : <Button
                children='Log in to Google to submit a review'
                color='danger'
                disabled='true'
            />
            }
            <LinkButton
                link={'/restaurants/' + currentRestaurant.id}
                children='Back to all reviews'
                color='secondary'
            />
        </form>
        {!loggedIn &&
            <div>
                <img src={FryposalLoginImage} className="fryposal-login-image" alt="fyposal-login-image"/>
                <br></br>
                <h4 className="login-requirement-message">"Will you log in for me?"</h4>
            </div>
        }
        </div>
)
}

ReviewForm.propTypes = propTypes;

export default ReviewForm;
