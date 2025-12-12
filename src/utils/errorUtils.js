/**
 * Removes the selected error from an errors object on a user form.
 * @param {Object} errors - The user form's errors object
 * @param {string} errorKey - The key of the error to remove
 * @returns {Object} The empty errors object to return.
 */
export const clearError = (errors, errorToDelete) => {
    const newErrors = { ...errors };
    delete newErrors[errorToDelete];
    return newErrors;
};