import { PropTypes } from 'prop-types';
import { Form, FormGroup, Input, Label } from 'reactstrap';

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
    accountId: PropTypes.string.isRequired,
    formErrors: PropTypes.object.isRequired,
    setFormErrors: PropTypes.func.isRequired,
    deleteFormError: PropTypes.func.isRequired,
    idToken: PropTypes.string,
};

const ReviewForm = ({ createReview, currentRestaurant, currentReview, updateCurrentReview, loggedIn, username, accountId, formErrors, setFormErrors, deleteFormError, idToken }) => {

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
        <Form
            onSubmit={handleSubmit}
            onChange={(event) => {
                if (!currentReview.accountId && accountId) {
                    updateCurrentReview('accountId', accountId);
                }
                updateCurrentReview(event.target.name, event.target.value);

                // Clear errors when user types in form fields.
                if (formErrors[event.target.name]) {
                    deleteFormError(event.target.name);
                }
            }}
        >
            {loggedIn &&
                <div><FormGroup>
                    <Label for="nameInput">
                        Name
                    </Label>
                    <Input
                        id="nameInput"
                        name="authorId"
                        value={username}
                        type="textarea"
                        disabled="true"
                    />
                </FormGroup>
                    <ScoreDropdown 
                        labelName="Score" 
                        name="score" 
                        id="scoreInput"
                        value={currentReview.score || ''}
                        onChange={(event) => {
                            if (!currentReview.accountId && accountId) {
                                updateCurrentReview('accountId', accountId);
                            }
                            updateCurrentReview(event.target.name, event.target.value);

                            // Clear errors when user types in form fields.
                            if (formErrors[event.target.name]) {
                                deleteFormError(event.target.name);
                            }
                        }}
                    />
                    {formErrors.score && <p className="text-danger">{formErrors.score}</p>}
                    
                    <FormGroup>
                        <Label for="titleInput">
                            Title
                        </Label>
                        <Input
                            id="titleInput"
                            name="title"
                            value={currentReview.title || ''}
                            placeholder="A title for your review"
                            type="textarea"
                            invalid={!!formErrors.title}
                        />
                    {formErrors.title && <p className="text-danger">{formErrors.title}</p>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="bodyInput">
                            Body
                        </Label>
                        <Input
                            id="bodyInput"
                            name="body"
                            value={currentReview.body || ''}
                            placeholder="Your review text here"
                            type="textarea"
                            invalid={!!formErrors.body}
                        />
                    {formErrors.body && <p className="text-danger">{formErrors.body}</p>}
                    </FormGroup></div>                
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
        </Form>
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