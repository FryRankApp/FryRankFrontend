/**
 * Removes the selected error from an errors object.
 * @param {Object} errors - The errors object
 * @param {string} errorToDelete - The key of the error to remove
 * @returns {Object} The empty errors object to return.
 */
export const clearError = (errors, errorToDelete) => {
    const newErrors = { ...errors };
    delete newErrors[errorToDelete];
    return newErrors;
};