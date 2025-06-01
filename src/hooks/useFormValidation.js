import { useState } from 'react';
import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

/**
 * Custom hook for form validation
 * Provides validation functions and error state management
 * @returns {Object} Validation functions and error state
 */
export const useFormValidation = () => {
  const [formError, setFormError] = useState('');

  /**
   * Validates a specific form field based on field name and value
   * @param {string} fieldName - Name of the field to validate
   * @param {string} value - Value to validate
   * @returns {boolean} - True if valid, false if invalid
   */
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'user_name':
        const name = value.trim();
        if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
          errorMessage = ERROR_MESSAGES.NAME_TOO_SHORT;
        }
        break;

      case 'user_email':
        const email = value.trim();
        if (!email || !email.match(VALIDATION_RULES.EMAIL_PATTERN)) {
          errorMessage = ERROR_MESSAGES.INVALID_EMAIL;
        }
        break;

      case 'message':
        const message = value.trim();
        if (message.length < VALIDATION_RULES.MESSAGE_MIN_LENGTH) {
          errorMessage = ERROR_MESSAGES.MESSAGE_TOO_SHORT;
        }
        break;

      default:
        break;
    }
    
    setFormError(errorMessage);
    return errorMessage === '';
  };

  /**
   * Validates all form fields at once
   * @param {Object} formData - Object containing form field values
   * @returns {boolean} - True if all fields are valid
   */
  const validateAllFields = (formData) => {
    const { name, email, message } = formData;

    if (!validateField('user_name', name)) return false;
    if (!validateField('user_email', email)) return false;
    if (!validateField('message', message)) return false;

    return true;
  };

  /**
   * Clears any existing form errors
   */
  const clearError = () => {
    setFormError('');
  };

  return {
    formError,
    validateField,
    validateAllFields,
    clearError,
    setFormError,
  };
};