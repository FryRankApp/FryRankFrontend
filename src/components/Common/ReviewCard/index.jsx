import { PropTypes } from 'prop-types';
import { Card, CardBody, CardSubtitle, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Score } from '../';
import { useSelector, useDispatch } from 'react-redux';
import {
    PATH_ACCOUNT_REVIEWS,
    PATH_RESTAURANT_REVIEWS,
    PATH_VARIABLE_ACCOUNT_ID,
    PATH_VARIABLE_RESTAURANT_ID
} from '../../../constants.js'
import '../style.css'
import { FaEdit, FaTrash, FaThumbsUp, FaThumbsDown, FaHeart } from "react-icons/fa";
import EditReviewModal from '../../EditReview/EditReviewModal.jsx';
import DeleteReviewModal from '../../DeleteReview/DeleteReviewModal.jsx';
import { reviewsActions } from '../../../redux/reducers/reviews';
import { useState, useCallback, useMemo } from 'react';

const propTypes = {
    review: PropTypes.object.isRequired,
    restaurant: PropTypes.object
};

const ReviewCard = ({ review, restaurant }) => {
    const dispatch = useDispatch();
    const userAccountId = useSelector((state)=>state.userReducer.userData?.sub);
    const loggedIn = useSelector((state) => state.userReducer.loggedIn);
    const updatedReview = useSelector((state) => state.reviewsReducer.reviews?.find(r => r.reviewId === review.reviewId && r.accountId === review.accountId));
    const isReviewAuthor = useMemo(() => userAccountId === review.accountId, [userAccountId, review.accountId]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const idToken = useSelector((state) => state.userReducer.idToken);
    const displayReview = updatedReview ?? review;
    const reactionCounts = displayReview?.reactionCounts || {};
    const myReactions = displayReview?.myReactions || {};
  
    const editSave = useCallback(()=>{
        setIsEditModalOpen((prev)=>!prev);
    },[])

    const deleteReview = useCallback(()=>{
        setIsDeleteModalOpen((prev)=>!prev);
    },[])

    const onToggleReaction = useCallback((reactionType) => {
        if (!loggedIn || !idToken) {
            return;
        }
        const currentlyOn = !!myReactions?.[
            reactionType === "THUMBS_UP"
                ? "thumbsUp"
                : reactionType === "THUMBS_DOWN"
                    ? "thumbsDown"
                    : "heart"
        ];
        dispatch(reviewsActions.startLikeReviewRequest(
            displayReview.reviewId,
            displayReview.accountId,
            reactionType,
            !currentlyOn,
            idToken
        ));
    }, [dispatch, loggedIn, idToken, myReactions, displayReview]);

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
                    <div className="d-flex gap-3 align-items-center mb-2">
                        <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                            onClick={() => onToggleReaction("THUMBS_UP")}
                            disabled={!loggedIn}
                            title={loggedIn ? "Toggle thumbs up" : "Sign in to react"}
                        >
                            <FaThumbsUp color={myReactions.thumbsUp ? "#0d6efd" : "#6c757d"} />
                            <span>{reactionCounts.thumbsUp ?? 0}</span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                            onClick={() => onToggleReaction("THUMBS_DOWN")}
                            disabled={!loggedIn}
                            title={loggedIn ? "Toggle thumbs down" : "Sign in to react"}
                        >
                            <FaThumbsDown color={myReactions.thumbsDown ? "#dc3545" : "#6c757d"} />
                            <span>{reactionCounts.thumbsDown ?? 0}</span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1"
                            onClick={() => onToggleReaction("HEART")}
                            disabled={!loggedIn}
                            title={loggedIn ? "Toggle heart" : "Sign in to react"}
                        >
                            <FaHeart color={myReactions.heart ? "#dc3545" : "#6c757d"} />
                            <span>{reactionCounts.heart ?? 0}</span>
                        </button>
                    </div>
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
