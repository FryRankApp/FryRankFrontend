import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { reviewsActions } from '../../redux/reducers/reviews';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Input, Label, FormGroup } from 'reactstrap';
import FryposalLoginImage from "../../Fryposal.png";
import { PropTypes } from 'prop-types';
import { ScoreDropdown, validateReview } from "../Common";
import { clearError } from '../../utils/errorUtils';

const propTypes = {
    modal: PropTypes.bool.isRequired,
    signIn: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    review: PropTypes.object.isRequired
};

export default function EditReviewModal({ modal, signIn, save, review }){
    const dispatch = useDispatch();
    const [updatedReview, setUpdatedReview] = useState(review);
    const [errors, setErrors] = useState({});
    
    useEffect(() => {
        setUpdatedReview(review); // Makes sure the review contents prepopulates with the correct values
        setErrors({}); // Clear errors when review changes
    }, [review]);

    const validateForm = () => {
        const newErrors = validateReview(updatedReview);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = async ()=>{
        if (validateForm()) {
            dispatch(reviewsActions.startCreateReviewForRestaurantRequest(updatedReview));
            save();
        }
    };

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setUpdatedReview(prevReview => ({ ...prevReview, [name]: value, }));
        
        // Clear errors when user types in form fields.
        if (errors[name]) {
            setErrors(clearError(errors, name));
        }
    };

    return (
        <>
            <Modal isOpen={modal} toggle={save} > 
                <ModalHeader toggle={save}>Let's edit your review</ModalHeader>
                <ModalBody>
                    {signIn? (
                    <>
                        <FormGroup>
                            <Label for="nameInput">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={updatedReview.title || ''} 
                                onChange={handleInputChange} 
                                placeholder="Enter new title"
                                invalid={!!errors.title}
                            />
                            {errors.title && <p className="text-danger">{errors.title}</p>}
                        </FormGroup>
                        <ScoreDropdown 
                            labelName="Score" 
                            name="score" 
                            id="scoreInput" 
                            value={updatedReview.score || ''} 
                            onChange={handleInputChange}
                        />
                        {errors.score && <p className="text-danger">{errors.score}</p>}
                        <FormGroup>
                            <Label for="bodyInput">Body</Label>
                            <Input
                                name="body"
                                placeholder="Your review text here"
                                type="textarea"
                                value={updatedReview.body || ''} 
                                onChange={handleInputChange}
                                invalid={!!errors.body}
                            />
                            {errors.body && <p className="text-danger">{errors.body}</p>}
                        </FormGroup>
                    </>
                    ):(
                        <div>
                            <img src={FryposalLoginImage} className="fryposal-login-image" alt="fyposal-login-image"/>
                            <br></br>
                            <h4 className="login-requirement-message">"Will you log in for me?"</h4>
                        </div>
                    )}
                </ModalBody>
                    {signIn && (<ModalFooter>
                        <Button color="primary" onClick={handleSaveClick}>
                            Save Edit
                        </Button> {'  '}
                        <Button color="secondary" onClick={save}>
                            Cancel Edit
                        </Button>
                    </ModalFooter>
                )}
            </Modal> 
        </>
    )
}

EditReviewModal.propTypes = propTypes;