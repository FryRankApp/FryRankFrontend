/**
 * Validates a review object to ensure all required fields are present and non-empty.
 * @param {Object} review - The review object to validate
 * @returns {Object} An object containing validation errors (empty if valid)
 */
export const validateReview = (review) => {
    const errors = {};
    
    // Score is required.
    if (!review.score || review.score === "") {
        errors.score = 'Please select a score.';
    }
    
    // Title is required.
    const title = review.title || "";
    if (!title || title.trim() === "") {
        errors.title = 'Title is required to submit a review.';
    }
    
    // Body is required.
    const body = review.body || "";
    if (!body || body.trim() === "") {
        errors.body = 'Please enter a few words about your experience.';
    }
    
    return errors;
};

/**
 * Checks if a review is valid (has no validation errors).
 * @param {Object} review - The review object to validate
 * @returns {boolean} True if the review is valid, false otherwise
 */
export const isReviewValid = (review) => {
    const errors = validateReview(review);
    return Object.keys(errors).length === 0;
};

