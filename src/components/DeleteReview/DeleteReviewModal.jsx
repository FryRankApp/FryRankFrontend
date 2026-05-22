import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reviewsActions } from '../../redux/reducers/reviews';
import FryposalLoginImage from "../../Fryposal.png";
import { PropTypes } from 'prop-types';
import { Button } from '../Common';

const propTypes = {
    modal: PropTypes.bool.isRequired,
    signIn: PropTypes.bool.isRequired,
    option: PropTypes.func.isRequired,
    reviewId: PropTypes.string
};

export default function DeleteReviewModal({ modal, signIn, option, reviewId }){
    const dispatch = useDispatch();
    const idToken = useSelector(state => state.userReducer.idToken);

    if (!modal) return null;

    const handleDeleteClick = async () =>{
        dispatch(reviewsActions.startDeleteReviewForRestaurantRequest(reviewId, idToken));
        option();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Delete review</h3>
                    <button className="text-slate-600" onClick={option}>X</button>
                </div>
                <div>
                    {signIn ? (
                        <h4 className="deleteMessage">Delete the selected review?</h4>
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
                        <Button color="primary" onClick={handleDeleteClick}>Yes, delete</Button>
                        <Button color="secondary" onClick={option}>No, cancel</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

DeleteReviewModal.propTypes = propTypes;
