import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

/**
 * Custom hook for EmailJS functionality
 * Handles email service initialization and form submission
 * @returns {Object} Email submission function and state
 */
export const useEmailJS = () => {
  const [formSuccess, setFormSuccess] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS when hook mounts
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.USER_ID);
  }, []);

  /**
   * Sends email using EmailJS service
   * @param {Object} formData - Form data to send
   * @param {Function} onError - Error callback function
   * @returns {Promise<boolean>} - Success status
   */
  const sendEmail = async (formData, onError) => {
    setIsSubmitting(true);
    
    // Prepare email template data
    const emailData = {
      from_name: formData.name,
      to_name: 'Charles Hanna',
      reply_to: formData.email,
      message: formData.message,
    };

    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        emailData,
        EMAILJS_CONFIG.USER_ID
      );
      
      // Handle successful submission
      setShowForm(false);
      setFormSuccess(SUCCESS_MESSAGES.MESSAGE_SENT);
      setIsSubmitting(false);
      return true;
      
    } catch (error) {
      console.error('Error sending email:', error);
      onError(ERROR_MESSAGES.SEND_FAILED);
      setFormSuccess('');
      setIsSubmitting(false);
      return false;
    }
  };

  /**
   * Resets the form to initial state
   */
  const resetForm = () => {
    setShowForm(true);
    setFormSuccess('');
    setIsSubmitting(false);
  };

  return {
    formSuccess,
    showForm,
    isSubmitting,
    sendEmail,
    resetForm,
  };
};