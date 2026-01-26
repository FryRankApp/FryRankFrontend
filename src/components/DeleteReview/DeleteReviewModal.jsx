import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reviewsActions } from '../../redux/reducers/reviews';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Input, Label, FormGroup } from 'reactstrap';
import FryposalLoginImage from "../../Fryposal.png";
import { PropTypes } from 'prop-types';

const propTypes = {
    modal: PropTypes.bool.isRequired,
    signIn: PropTypes.bool.isRequired,
    delete: PropTypes.func.isRequired,
    review: PropTypes.object.isRequired
};

export default function DeleteReviewModal({ modal, signIn, option, reviewId }){
    const dispatch = useDispatch();
    const handleDeleteClick = async () =>{
        dispatch(reviewsActions.startDeleteReviewForRestaurantRequest(reviewId));
        option();
    }

    return (
        <>
            <Modal isOpen={modal} toggle={option} > 
                <ModalHeader toggle={option}>Delete review</ModalHeader>
                <ModalBody>
                    {signIn? (
                    <>
                        <FormGroup>
                            <h4 className="deleteMessage">Delete the selected review?</h4>
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
                        <Button color="primary" onClick={handleDeleteClick}>
                            Yes, delete
                        </Button> {'  '}
                        <Button color="secondary" onClick={option}>
                            No, cancel
                        </Button>
                    </ModalFooter>
                )}
            </Modal> 
        </>
    )
}

DeleteReviewModal.propTypes = propTypes;