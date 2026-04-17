import { IoReturnUpBack } from "react-icons/io5";

export const types = {
    GET_RESTAURANT_REVIEWS_REQUEST: "GET_RESTAURANT_REVIEWS_REQUEST",
    GET_RESTAURANT_REVIEWS_SUCCESS: "GET_RESTAURANT_REVIEWS_SUCCESS",
    GET_RESTAURANT_REVIEWS_FAILURE: "GET_RESTAURANT_REVIEWS_FAILURE",
    GET_ACCOUNT_REVIEWS_REQUEST: "GET_ACCOUNT_REVIEWS_REQUEST",
    GET_ACCOUNT_REVIEWS_SUCCESS: "GET_ACCOUNT_REVIEWS_SUCCESS",
    GET_ACCOUNT_REVIEWS_FAILURE: "GET_ACCOUNT_REVIEWS_FAILURE",
    CREATE_REVIEW_FOR_RESTAURANT_REQUEST: "CREATE_REVIEW_FOR_RESTAURANT_REQUEST",
    CREATE_REVIEW_FOR_RESTAURANT_SUCCESS: "CREATE_REVIEW_FOR_RESTAURANT_SUCCESS",
    CREATE_REVIEW_FOR_RESTAURANT_FAILURE: "CREATE_REVIEW_FOR_RESTAURANT_FAILURE",
    DELETE_REVIEW_FOR_RESTAURANT_REQUEST: "DELETE_REVIEW_FOR_RESTAURANT_REQUEST",
    DELETE_REVIEW_FOR_RESTAURANT_SUCCESS: "DELETE_REVIEW_FOR_RESTAURANT_SUCCESS",
    DELETE_REVIEW_FOR_RESTAURANT_FAILURE: "DELETE_REVIEW_FOR_RESTAURANT_FAILURE",
    UPDATE_CURRENT_REVIEW: "UPDATE_CURRENT_REVIEW",
    RESET_CREATE_REQUEST: "RESET_CREATE_REQUEST",
    RESET_REVIEWS: "RESET_REVIEWS",
    SET_REVIEWS: "SET_REVIEWS",
    SET_FORM_ERROR: "SET_FORM_ERROR",
    DELETE_FORM_ERROR: "DELETE_FORM_ERROR",
    INCREMENT_LIKE_COUNT: "INCREMENT_LIKE_COUNT",
    LIKE_REVIEW_REQUEST: "LIKE_REVIEW_REQUEST",
    ROLLBACK_LIKE_REVIEW: "ROLLBACK_LIKE_REVIEW"
}

export const initialState = {
  reviews: null,
  nextCursor: null,
  averageScore: null,
  currentReview: {
    "restaurantId": null,
    "score": null,
    "title": null,
    "body": null,
  },
  error: '',
  formErrors: {},
  successfulCreate: null,
  successfulDelete: null,
  requestingReviews: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case types.GET_RESTAURANT_REVIEWS_REQUEST: {
            return {
                ...state,
                requestingReviews: true,
            };
        }

        case types.GET_RESTAURANT_REVIEWS_SUCCESS: {
            return {
                ...state,
                reviews: [...(state.reviews || []), ...action.reviewsData.reviews],
                nextCursor: action.nextCursor,
                averageScore: action.averageScore,
                requestingReviews: false,
                error: ''
            };
        }

        case types.GET_RESTAURANT_REVIEWS_FAILURE: {
            return {
                ...state,
                requestingReviews: false,
                error: action.error,
            }
        }

        case types.GET_ACCOUNT_REVIEWS_REQUEST: {
                    return {
                        ...state,
                        requestingReviews: true,
                    };
                }

        case types.GET_ACCOUNT_REVIEWS_SUCCESS: {
            return {
                ...state,
                reviews: [...(state.reviews || []), ...action.reviewsData.reviews],
                nextCursor: action.nextCursor,
                requestingReviews: false,
                error: ''
            };
        }

        case types.GET_ACCOUNT_REVIEWS_FAILURE: {
            return {
                ...state,
                requestingReviews: false,
                error: action.error,
            }
        }

        case types.CREATE_REVIEW_FOR_RESTAURANT_REQUEST: {           
            return {
                ...state,
                currentReview: {
                    // Reset the current review, except for the restaurantId, which gets set on page load
                    ...initialState.currentReview,
                    restaurantId: state.currentReview.restaurantId
                },
                formErrors: initialState.formErrors
            };
        }

        case types.CREATE_REVIEW_FOR_RESTAURANT_SUCCESS: {
            const updatedReviews = state?.reviews?.map(review =>
                review.reviewId === action.data.reviewId ? action.data : review
            );

            return {
                ...state,
                reviews: updatedReviews,
                successfulCreate: true,
                error: ''
            };
        }

        case types.CREATE_REVIEW_FOR_RESTAURANT_FAILURE: {
            return {
                ...state,
                successfulCreate: false,
                error: action.error,    
            }
        }

        case types.DELETE_REVIEW_FOR_RESTAURANT_REQUEST: {           
            return {
                ...state,
                currentReview: {
                    ...initialState.currentReview
                }
            };
        }

        case types.DELETE_REVIEW_FOR_RESTAURANT_SUCCESS: {
            const updatedReviews = state?.reviews?.filter(review =>
                review.reviewId !== action.data
            );

            return {
                ...state,
                reviews: updatedReviews,
                successfulDelete: true,
                error: ''
            };
        }

        case types.DELETE_REVIEW_FOR_RESTAURANT_FAILURE: {
            return {
                ...state,
                successfulDelete: false,
                error: action.error,    
            }
        }

        case types.UPDATE_CURRENT_REVIEW: {
            return {
                ...state,
                currentReview: {
                    ...state.currentReview,
                    [action.name]: action.value !== "" ? action.value : null
                }
            }
        }

        case types.RESET_CREATE_REQUEST: {
            return {
                ...state,
                successfulCreate: null
            }
        }

        case types.RESET_REVIEWS: {
            return {
                ...state,
                reviews: initialState.reviews,
                nextCursor: initialState.nextCursor,
            }
        }

        case types.SET_REVIEWS: {
            return {
                ...state,
                reviews: action.payload
            }
        }

        case types.SET_FORM_ERROR: {
            return {
                ...state,
                formErrors: action.errors
            }
        }

        case types.DELETE_FORM_ERROR: {
            const newFormErrors = { ...state.formErrors };
            delete newFormErrors[action.errorKey];
            return {
                ...state,
                formErrors: newFormErrors
            };
        }

        case types.INCREMENT_LIKE_COUNT: {
            const { reviewId } = action;
            const updatedReviews = state?.reviews?.map(review =>
                review.reviewId === reviewId
                    ? { ...review, likeCount: (review.likeCount ?? 0) + 1 }
                    : review
            );
            return {
                ...state,
                reviews: updatedReviews
            };
        }

        case types.ROLLBACK_LIKE_REVIEW: {
            const { reviewId } = action;
            const updatedReviews = state?.reviews?.map(review =>
                review.reviewId === reviewId
                    ? { ...review, likeCount: Math.max(0, (review.likeCount ?? 1) - 1) }
                    : review
            );
            return {
                ...state,
                reviews: updatedReviews
            };
        }

        default:
            return state;
  }
}

export const reviewsActions = {
    startGetAllReviewsForRestaurantRequest: (restaurantId, cursor = null) => ({ type: types.GET_RESTAURANT_REVIEWS_REQUEST, restaurantId, cursor }),
    successfulGetAllReviewsForRestaurantRequest: (reviewsData, averageScore, nextCursor) => ({ type: types.GET_RESTAURANT_REVIEWS_SUCCESS, reviewsData, averageScore, nextCursor }),
    failedGetAllReviewsForRestaurantRequest: error => ({ type: types.GET_RESTAURANT_REVIEWS_FAILURE, error }),
    startGetAllReviewsForAccountRequest: (accountId, cursor = null) => ({ type: types.GET_ACCOUNT_REVIEWS_REQUEST, accountId, cursor }),
    successfulGetAllReviewsForAccountRequest: (reviewsData, nextCursor) => ({ type: types.GET_ACCOUNT_REVIEWS_SUCCESS, reviewsData, nextCursor }),
    failedGetAllReviewsForAccountRequest: error => ({ type: types.GET_ACCOUNT_REVIEWS_FAILURE, error }),
    startCreateReviewForRestaurantRequest: (review, idToken) => ({ type: types.CREATE_REVIEW_FOR_RESTAURANT_REQUEST, review, idToken }),
    successfulCreateReviewForRestaurantRequest: (data) => ({ type: types.CREATE_REVIEW_FOR_RESTAURANT_SUCCESS, data }),
    failedCreateReviewForRestaurantRequest: error => ({ type: types.CREATE_REVIEW_FOR_RESTAURANT_FAILURE, error }),
    startDeleteReviewForRestaurantRequest: (reviewId, idToken) => ({ type: types.DELETE_REVIEW_FOR_RESTAURANT_REQUEST, reviewId, idToken }),
    successfulDeleteReviewForRestaurantRequest: (data) => ({ type: types.DELETE_REVIEW_FOR_RESTAURANT_SUCCESS, data }),
    failedDeleteReviewForRestaurantRequest: error => ({ type: types.DELETE_REVIEW_FOR_RESTAURANT_FAILURE, error }),
    updateCurrentReview: (name, value) => ({ type: types.UPDATE_CURRENT_REVIEW, name, value }),
    resetCreateRequest: () => ({ type: types.RESET_CREATE_REQUEST }),
    resetReviews: () => ({ type: types.RESET_REVIEWS }),
    setReviews: (reviews) => ({ type: types.SET_REVIEWS, payload: reviews }),
    setFormErrors: (errors) => ({ type: types.SET_FORM_ERROR, errors }),
    deleteFormError: (errorKey) => ({ type: types.DELETE_FORM_ERROR, errorKey }),
    incrementLikeCount: (reviewId) => ({ type: types.INCREMENT_LIKE_COUNT, reviewId }),
    startLikeReviewRequest: (reviewId, likeCount, idToken) => ({ type: types.LIKE_REVIEW_REQUEST, reviewId, likeCount, idToken }),
    rollbackLikeReview: (reviewId) => ({ type: types.ROLLBACK_LIKE_REVIEW, reviewId })
}
