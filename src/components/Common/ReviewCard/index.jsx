import { PropTypes } from 'prop-types';
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
import DeleteReviewModal from '../../DeleteReview/DeleteReviewModal.jsx'
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
            <div className="relative mb-3 w-[92vw] max-w-[42rem] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <h3 className="inline-block text-xl font-semibold">
                        {updatedReview?.title || review.title}
                        </h3>
                        <Score size="md" score={review.score} />
                        {isReviewAuthor && ( <FaEdit style={{ fontSize: '24px', position: 'absolute', top: '19px', right: '50px', cursor: 'pointer' }} onClick={editSave} /> )}  
                        {isReviewAuthor && ( <FaTrash style={{ fontSize: '24px', position: 'absolute', top: '19px', right: '15px', cursor: 'pointer' }} onClick={deleteReview} /> )}                      
                    </div>
                    { restaurant &&
                        <div>
                            <h5 className="mb-2 mr-2 inline text-lg text-slate-900">
                                <Link to={`${PATH_RESTAURANT_REVIEWS}`.replace(PATH_VARIABLE_RESTAURANT_ID, restaurant.id)}>{restaurant.displayName.text}</Link>
                            </h5>
                            <p className="mb-2 inline text-slate-600">
                                {restaurant.formattedAddress}
                            </p>
                        </div>
                    }
                    <h6 className="mb-3 text-sm text-slate-500">
                        By: { review.accountId
                            ? <Link to={`${PATH_ACCOUNT_REVIEWS}`.replace(PATH_VARIABLE_ACCOUNT_ID, review.accountId)}>
                                {review.userMetadata ? review.userMetadata.username : (review.authorId ? review.authorId : review.accountId)}
                            </Link>
                            : <div className="inline">{review.authorId}</div> }
                    </h6>
                    <p className="text-slate-800">
                        {review.body}
                    </p>
                    {review.isoDateTime &&
                        <h6 className="mb-2 italic text-slate-500">
                            {new Date(review.isoDateTime).toLocaleString()}
                        </h6>
                    }
            </div>
            <EditReviewModal 
                review={review} 
                save={editSave} 
                modal={isEditModalOpen}
                signIn={userAccountId}
            /> 
            <DeleteReviewModal
                reviewId={review.reviewId} 
                option={deleteReview} 
                modal={isDeleteModalOpen}
                signIn={userAccountId}
            /> 
        </>
    )
}

ReviewCard.propTypes = propTypes;

export default ReviewCard;
