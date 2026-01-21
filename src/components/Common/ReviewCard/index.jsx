import { PropTypes } from 'prop-types'
import Link from 'next/link'
import { Score } from '../'
import { useSelector } from 'react-redux'
import {
    PATH_ACCOUNT_REVIEWS,
    PATH_RESTAURANT_REVIEWS,
    PATH_VARIABLE_ACCOUNT_ID,
    PATH_VARIABLE_RESTAURANT_ID
} from '../../../constants.js'
import { Edit, Calendar, User } from 'lucide-react'
import EditReviewModal from '../../EditReview/EditReviewModal.jsx'
import { useState, useCallback, useMemo } from 'react'

const propTypes = {
    review: PropTypes.object.isRequired,
    restaurant: PropTypes.object
}

const ReviewCard = ({ review, restaurant }) => {
    const userAccountId = useSelector((state)=>state.userReducer.userData?.sub)
    const updatedReview = useSelector((state) => state.reviewsReducer.reviews?.find(r => r.reviewId === review.reviewId && r.accountId === review.accountId))
    const isReviewAuthor = useMemo(() => userAccountId === review.accountId, [userAccountId, review.accountId])
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const save = useCallback(()=>{
        setIsModalOpen((prev)=>!prev)
    },[])

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
                {/* Header with title and rating */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {updatedReview?.title || review.title}
                        </h3>
                        <Score size="md" score={review.score} />
                    </div>
                    {isReviewAuthor && (
                        <button 
                            onClick={save}
                            className="p-2 text-gray-500 hover:text-fry-orange transition-colors duration-200"
                            aria-label="Edit review"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Restaurant info */}
                {restaurant && (
                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <Link 
                                href={`${PATH_RESTAURANT_REVIEWS}`.replace(PATH_VARIABLE_RESTAURANT_ID, restaurant.id)}
                                className="text-fry-orange hover:text-fry-orange/80 transition-colors duration-200 font-medium"
                            >
                                {restaurant.displayName?.text || restaurant.name}
                            </Link>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {restaurant.formattedAddress || restaurant.address}
                            </span>
                        </div>
                    </div>
                )}

                {/* Review author */}
                <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        By:{' '}
                        {review.accountId ? (
                            <Link 
                                href={`${PATH_ACCOUNT_REVIEWS}`.replace(PATH_VARIABLE_ACCOUNT_ID, review.accountId)}
                                className="text-fry-orange hover:text-fry-orange/80 transition-colors duration-200"
                            >
                                {review.userMetadata ? review.userMetadata.username : (review.authorId ? review.authorId : review.accountId)}
                            </Link>
                        ) : (
                            <span>{review.authorId}</span>
                        )}
                    </span>
                </div>

                {/* Review body */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {review.body}
                </p>

                {/* Date */}
                {review.isoDateTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(review.isoDateTime).toLocaleString()}</span>
                    </div>
                )}
            </div>
            
            <EditReviewModal 
                review={review} 
                save={save} 
                modal={isModalOpen}
                signIn={userAccountId}
            /> 
        </>
    )
}

ReviewCard.propTypes = propTypes

export default ReviewCard