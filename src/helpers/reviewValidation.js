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
    if (!review.title || review.title.trim() === "") {
        errors.title = 'Title is required to submit a review.';
    }
    
    // Body is required.
    if (!review.body || review.body.trim() === "") {
        errors.body = 'Please enter a few words about your experience.';
    }
    
    return errors;
};