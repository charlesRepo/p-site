import React from 'react';
import { useFormValidation } from '../hooks/useFormValidation';
import { useEmailJS } from '../hooks/useEmailJS';
import { VALIDATION_RULES } from '../constants';

/**
 * ContactForm Component
 * A reusable contact form with validation and email functionality
 * @returns {JSX.Element} Contact form component
 */
const ContactForm = () => {
  const { formError, validateField, validateAllFields, setFormError } = useFormValidation();
  const { formSuccess, showForm, isSubmitting, sendEmail } = useEmailJS();

  /**
   * Handles form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = {
      name: form.user_name?.value || '',
      email: form.user_email?.value || '',
      message: form.message?.value || '',
    };
    
    // Validate all fields before submission
    if (!validateAllFields(formData)) {
      return;
    }

    // Send email using EmailJS hook
    const success = await sendEmail(formData, setFormError);
    
    // Reset form if successful
    if (success) {
      form.reset();
    }
  };

  /**
   * Renders form input field with validation
   * @param {Object} props - Input field properties
   * @returns {JSX.Element} Form input with validation
   */
  const renderFormField = ({
    type = 'text',
    name,
    placeholder,
    fieldType,
    isTextarea = false,
    ...props
  }) => {
    const hasError = formError.includes(
      fieldType === 'user_name' ? 'Name' : 
      fieldType === 'user_email' ? 'email' : 'Message'
    );

    const commonProps = {
      name,
      placeholder,
      required: true,
      className: hasError ? 'error' : '',
      onBlur: (e) => validateField(fieldType, e.target.value),
      disabled: isSubmitting,
      ...props,
    };

    return (
      <div className="form-group">
        {isTextarea ? (
          <textarea
            {...commonProps}
            minLength={VALIDATION_RULES.MESSAGE_MIN_LENGTH}
            maxLength={VALIDATION_RULES.MESSAGE_MAX_LENGTH}
            title={`Please enter a message between ${VALIDATION_RULES.MESSAGE_MIN_LENGTH} and ${VALIDATION_RULES.MESSAGE_MAX_LENGTH} characters`}
          />
        ) : (
          <input
            type={type}
            {...commonProps}
            minLength={fieldType === 'user_name' ? VALIDATION_RULES.NAME_MIN_LENGTH : undefined}
            maxLength={fieldType === 'user_name' ? VALIDATION_RULES.NAME_MAX_LENGTH : undefined}
            pattern={fieldType === 'user_email' ? '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' : undefined}
            title={
              fieldType === 'user_name' 
                ? 'Please enter your name (minimum 2 characters)'
                : 'Please enter a valid email address'
            }
          />
        )}
        {hasError && (
          <div className="form-error-message">{formError}</div>
        )}
      </div>
    );
  };

  return (
    <div className="contact-form">
      {showForm ? (
        <form id="contact-form" onSubmit={handleSubmit} noValidate role="form">
          {/* Name Field */}
          {renderFormField({
            name: 'user_name',
            placeholder: 'Your Name',
            fieldType: 'user_name',
          })}

          {/* Email Field */}
          {renderFormField({
            type: 'email',
            name: 'user_email',
            placeholder: 'Your Email',
            fieldType: 'user_email',
          })}

          {/* Message Field */}
          {renderFormField({
            name: 'message',
            placeholder: 'Your Message',
            fieldType: 'message',
            isTextarea: true,
          })}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send me a message'}
          </button>
        </form>
      ) : (
        <div className="form-message form-success">
          {formSuccess}
        </div>
      )}
    </div>
  );
};

export default ContactForm;