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
    UPDATE_CURRENT_REVIEW: "UPDATE_CURRENT_REVIEW",
    RESET_CREATE_REQUEST: "RESET_CREATE_REQUEST",
    RESET_REVIEWS: "RESET_REVIEWS",
    SET_REVIEWS: "SET_REVIEWS"
}

export const initialState = {
  reviews: null,
  averageScore: null,
  currentReview: {
    "restaurantId": null,
    "authorId": null,
    "score": null,
    "title": null,
    "body": null,
    "isoDateTime": null,
    "accountId": null,
  },
  error: '',
  successfulCreate: null,
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
                reviews: action.reviewsData.reviews,
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
                reviews: action.reviewsData.reviews,
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
                }
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
                reviews: initialState.reviews
            }
        }

        case types.SET_REVIEWS: {
            return {
                ...state,
                reviews: action.payload
            }
        }

        default:
            return state;
  }
}

export const reviewsActions = {
    startGetAllReviewsForRestaurantRequest: restaurantId => ({ type: types.GET_RESTAURANT_REVIEWS_REQUEST, restaurantId }),
    successfulGetAllReviewsForRestaurantRequest: (reviewsData, averageScore) => ({ type: types.GET_RESTAURANT_REVIEWS_SUCCESS, reviewsData, averageScore }),
    failedGetAllReviewsForRestaurantRequest: error => ({ type: types.GET_RESTAURANT_REVIEWS_FAILURE, error }),
    startGetAllReviewsForAccountRequest: accountId => ({ type: types.GET_ACCOUNT_REVIEWS_REQUEST, accountId }),
    successfulGetAllReviewsForAccountRequest: (reviewsData) => ({ type: types.GET_ACCOUNT_REVIEWS_SUCCESS, reviewsData }),
    failedGetAllReviewsForAccountRequest: error => ({ type: types.GET_ACCOUNT_REVIEWS_FAILURE, error }),
    startCreateReviewForRestaurantRequest: review => ({ type: types.CREATE_REVIEW_FOR_RESTAURANT_REQUEST, review }),
    successfulCreateReviewForRestaurantRequest: (data) => ({ type: types.CREATE_REVIEW_FOR_RESTAURANT_SUCCESS, data }),
    failedCreateReviewForRestaurantRequest: error => ({ type: types.CREATE_REVIEW_FOR_RESTAURANT_FAILURE, error }),
    updateCurrentReview: (name, value) => ({ type: types.UPDATE_CURRENT_REVIEW, name, value }),
    resetCreateRequest: () => ({ type: types.RESET_CREATE_REQUEST }),
    resetReviews: () => ({ type: types.RESET_REVIEWS }),
    setReviews: (reviews) => ({ type: types.SET_REVIEWS, payload: reviews })
}
