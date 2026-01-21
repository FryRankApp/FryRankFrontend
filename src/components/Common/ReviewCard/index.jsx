import { PropTypes } from 'prop-types';
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Score } from '../';
import { useSelector } from 'react-redux';
import {
    PATH_ACCOUNT_REVIEWS,
    PATH_RESTAURANT_REVIEWS,
    PATH_VARIABLE_ACCOUNT_ID,
    PATH_VARIABLE_RESTAURANT_ID
} from '../../../constants.js'
import '../style.css'
import { FaEdit, FaTrash } from "react-icons/fa";
import EditReviewModal from '../../EditReview/EditReviewModal.jsx';
import { useState, useCallback, useMemo } from 'react';

const propTypes = {
    review: PropTypes.object.isRequired,
    restaurant: PropTypes.object
};

const ReviewCard = ({ review, restaurant }) => {
    const userAccountId = useSelector((state)=>state.userReducer.userData?.sub);
    const updatedReview = useSelector((state) => state.reviewsReducer.reviews?.find(r => r.reviewId === review.reviewId && r.accountId === review.accountId));
    const isReviewAuthor = useMemo(() => userAccountId === review.accountId, [userAccountId, review.accountId]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const editSave = useCallback(()=>{
        setIsEditModalOpen((prev)=>!prev);
    },[])

    const deleteReview = useCallback(()=>{
        setIsDeleteModalOpen((prev)=>!prev);
    },[])

    return (
        <>
            <Card
                color="warning"
                className="mb-2"
                style={{
                    maxWidth: "36rem",
                    width: "90vw"
                }}
            >
                <CardBody>
                    <div>
                        <CardTitle tag="h3" style={{ display: "inline-block" }}>
                        {updatedReview?.title || review.title}
                        </CardTitle>
                        <Score size="md" score={review.score} />
                        {isReviewAuthor && ( <FaEdit style={{ fontSize: '24px', position: 'absolute', top: '19px', right: '50px', cursor: 'pointer' }} onClick={editSave} /> )}  
                        {isReviewAuthor && ( <FaTrash style={{ fontSize: '24px', position: 'absolute', top: '19px', right: '15px', cursor: 'pointer' }} onClick={deleteReview} /> )}                      
                    </div>
                    { restaurant &&
                        <div>
                            <CardSubtitle
                                className="inline mb-2 me-2 text-danger"
                                tag="h5"
                            >
                                <Link to={`${PATH_RESTAURANT_REVIEWS}`.replace(PATH_VARIABLE_RESTAURANT_ID, restaurant.id)}>{restaurant.displayName.text}</Link>
                            </CardSubtitle>
                            <CardText className="inline mb-2">
                                {restaurant.formattedAddress}
                            </CardText>
                        </div>
                    }
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        By: { review.accountId
                            ? <Link to={`${PATH_ACCOUNT_REVIEWS}`.replace(PATH_VARIABLE_ACCOUNT_ID, review.accountId)}>
                                {review.userMetadata ? review.userMetadata.username : (review.authorId ? review.authorId : review.accountId)}
                            </Link>
                            : <div className="inline">{review.authorId}</div> }
                    </CardSubtitle>
                    <CardText>
                        {review.body}
                    </CardText>
                    {review.isoDateTime &&
                        <CardSubtitle className="mb-2 text-muted" style={{fontStyle: "italic"}} tag="h6">
                            {new Date(review.isoDateTime).toLocaleString()}
                        </CardSubtitle>
                    }
                </CardBody>
            </Card>
            <EditReviewModal 
                review={review} 
                save={editSave} 
                modal={isEditModalOpen}
                signIn={userAccountId}
            /> 
            <DeleteReviewModal //Todo for next time: Make a separate modal for deleting a review
                review={review} 
                save={deleteReview} 
                modal={isDeleteModalOpen}
                signIn={userAccountId}
            /> 
        </>
    )
}

ReviewCard.propTypes = propTypes;

export default ReviewCard;