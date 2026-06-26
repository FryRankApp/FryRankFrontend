import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reviewsActions } from '../../redux/reducers/reviews';
import FryposalLoginImage from "../../Fryposal.png";
import { PropTypes } from 'prop-types';
import { ScoreDropdown, TagSelector, validateReview, Button } from "../Common";

const propTypes = {
    modal: PropTypes.bool.isRequired,
    signIn: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    review: PropTypes.object.isRequired
};

export default function EditReviewModal({ modal, signIn, save, review }){
    const dispatch = useDispatch();
    const formErrors = useSelector(state => state.reviewsReducer.formErrors);
    const idToken = useSelector(state => state.userReducer.idToken);
    const [updatedReview, setUpdatedReview] = useState(review);

    useEffect(() => {
        setUpdatedReview(review);
        dispatch(reviewsActions.setFormErrors({}));
    }, [review, dispatch]);

    if (!modal) return null;

    const validateForm = () => {
        const newErrors = validateReview(updatedReview);
        dispatch(reviewsActions.setFormErrors(newErrors));
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = async ()=>{
        if (validateForm()) {
            dispatch(reviewsActions.startCreateReviewForRestaurantRequest(updatedReview, idToken));
            save();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedReview(prevReview => ({ ...prevReview, [name]: value }));
        if (formErrors[name]) {
            dispatch(reviewsActions.deleteFormError(name));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Let&apos;s edit your review</h3>
                    <button className="text-slate-600" onClick={save}>X</button>
                </div>
                <div>
                    {signIn ? (
                        <>
                            <div className="mb-3">
                                <label htmlFor="titleInput" className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                                <input
                                    id="titleInput"
                                    className={`w-full rounded-md border px-3 py-2 ${formErrors.title ? "border-red-500" : "border-slate-300"}`}
                                    type="text"
                                    name="title"
                                    value={updatedReview.title || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter new title"
                                />
                                {formErrors.title && <p className="text-red-600">{formErrors.title}</p>}
                            </div>
                            <ScoreDropdown
                                labelName="Score"
                                name="score"
                                id="scoreInput"
                                value={updatedReview.score || ''}
                                onChange={handleInputChange}
                            />
                            {formErrors.score && <p className="text-red-600">{formErrors.score}</p>}
                            <div className="mb-3">
                                <label htmlFor="bodyInput" className="mb-1 block text-sm font-medium text-slate-700">Body</label>
                                <textarea
                                    id="bodyInput"
                                    className={`w-full rounded-md border px-3 py-2 ${formErrors.body ? "border-red-500" : "border-slate-300"}`}
                                    name="body"
                                    placeholder="Your review text here"
                                    value={updatedReview.body || ''}
                                    onChange={handleInputChange}
                                />
                                {formErrors.body && <p className="text-red-600">{formErrors.body}</p>}
                            </div>
                            <TagSelector
                                selectedTags={updatedReview.tags || []}
                                onChange={(nextTags) => handleInputChange({ target: { name: 'tags', value: nextTags } })}
                                error={formErrors.tags}
                            />
                        </>
                    ) : (
                        <div>
                            <img src={FryposalLoginImage} className="fryposal-login-image" alt="fyposal-login-image"/>
                            <br></br>
                            <h4 className="login-requirement-message">"Will you log in for me?"</h4>
                        </div>
                    )}
                </div>
                {signIn && (
                    <div className="mt-4">
                        <Button color="primary" onClick={handleSaveClick}>Save Edit</Button>
                        <Button color="secondary" onClick={save}>Cancel Edit</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

EditReviewModal.propTypes = propTypes;
