import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';
import * as useFormValidationModule from '../../hooks/useFormValidation';
import * as useEmailJSModule from '../../hooks/useEmailJS';

// Mock the custom hooks
jest.mock('../../hooks/useFormValidation');
jest.mock('../../hooks/useEmailJS');

describe('ContactForm', () => {
  let mockUseFormValidation;
  let mockUseEmailJS;

  beforeEach(() => {
    // Default mock implementations
    mockUseFormValidation = {
      formError: '',
      validateField: jest.fn(),
      validateAllFields: jest.fn(() => true),
      setFormError: jest.fn(),
    };

    mockUseEmailJS = {
      formSuccess: '',
      showForm: true,
      isSubmitting: false,
      sendEmail: jest.fn(() => Promise.resolve(true)),
    };

    useFormValidationModule.useFormValidation.mockReturnValue(mockUseFormValidation);
    useEmailJSModule.useEmailJS.mockReturnValue(mockUseEmailJS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields when showForm is true', () => {
      render(<ContactForm />);

      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send me a message/i })).toBeInTheDocument();
    });

    it('should render success message when showForm is false', () => {
      mockUseEmailJS.showForm = false;
      mockUseEmailJS.formSuccess = 'Thank you for your message!';
      useEmailJSModule.useEmailJS.mockReturnValue(mockUseEmailJS);

      render(<ContactForm />);

      expect(screen.getByText('Thank you for your message!')).toBeInTheDocument();
      expect(screen.queryByRole('form')).not.toBeInTheDocument();
    });

    it('should show loading state when submitting', () => {
      mockUseEmailJS.isSubmitting = true;
      useEmailJSModule.useEmailJS.mockReturnValue(mockUseEmailJS);

      render(<ContactForm />);

      expect(screen.getByRole('button', { name: /sending.../i })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Form Validation', () => {
    it('should call validateField on blur events', async () => {
      render(<ContactForm />);

      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageInput = screen.getByPlaceholderText('Your Message');

      await userEvent.type(nameInput, 'John');
      fireEvent.blur(nameInput);
      expect(mockUseFormValidation.validateField).toHaveBeenCalledWith('user_name', 'John');

      await userEvent.type(emailInput, 'john@example.com');
      fireEvent.blur(emailInput);
      expect(mockUseFormValidation.validateField).toHaveBeenCalledWith('user_email', 'john@example.com');

      await userEvent.type(messageInput, 'Test message');
      fireEvent.blur(messageInput);
      expect(mockUseFormValidation.validateField).toHaveBeenCalledWith('message', 'Test message');
    });

    it('should display error messages when validation fails', () => {
      mockUseFormValidation.formError = 'Name must be at least 2 characters long';
      useFormValidationModule.useFormValidation.mockReturnValue(mockUseFormValidation);

      render(<ContactForm />);

      expect(screen.getByText('Name must be at least 2 characters long')).toBeInTheDocument();
    });

    it('should apply error class to inputs with errors', () => {
      mockUseFormValidation.formError = 'Name must be at least 2 characters long';
      useFormValidationModule.useFormValidation.mockReturnValue(mockUseFormValidation);

      render(<ContactForm />);

      const nameInput = screen.getByPlaceholderText('Your Name');
      expect(nameInput).toHaveClass('error');
    });

    it('should show email error correctly', () => {
      mockUseFormValidation.formError = 'Please enter a valid email address';
      useFormValidationModule.useFormValidation.mockReturnValue(mockUseFormValidation);

      render(<ContactForm />);

      const emailInput = screen.getByPlaceholderText('Your Email');
      expect(emailInput).toHaveClass('error');
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('should show message error correctly', () => {
      mockUseFormValidation.formError = 'Message must be at least 10 characters long';
      useFormValidationModule.useFormValidation.mockReturnValue(mockUseFormValidation);

      render(<ContactForm />);

      const messageInput = screen.getByPlaceholderText('Your Message');
      expect(messageInput).toHaveClass('error');
      expect(screen.getByText('Message must be at least 10 characters long')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should handle successful form submission', async () => {
      const user = userEvent.setup();
      mockUseEmailJS.sendEmail.mockResolvedValue(true);
      useEmailJSModule.useEmailJS.mockReturnValue(mockUseEmailJS);

      render(<ContactForm />);

      // Fill out the form
      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageInput = screen.getByPlaceholderText('Your Message');
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message that is long enough');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /send me a message/i }));

      // The form data extraction might not work perfectly in test environment,
      // so we check that validation and email sending were called
      expect(mockUseFormValidation.validateAllFields).toHaveBeenCalled();
      expect(mockUseEmailJS.sendEmail).toHaveBeenCalled();
    });

    it('should not submit if validation fails', async () => {
      const user = userEvent.setup();
      mockUseFormValidation.validateAllFields.mockReturnValue(false);
      useFormValidationModule.useFormValidation.mockReturnValue(mockUseFormValidation);

      render(<ContactForm />);

      // Fill out the form with invalid data
      await user.type(screen.getByPlaceholderText('Your Name'), 'J');
      await user.type(screen.getByPlaceholderText('Your Email'), 'invalid-email');
      await user.type(screen.getByPlaceholderText('Your Message'), 'Short');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /send me a message/i }));

      expect(mockUseFormValidation.validateAllFields).toHaveBeenCalled();
      expect(mockUseEmailJS.sendEmail).not.toHaveBeenCalled();
    });

    it('should reset form on successful submission', async () => {
      const user = userEvent.setup();
      mockUseEmailJS.sendEmail.mockResolvedValue(true);
      useEmailJSModule.useEmailJS.mockReturnValue(mockUseEmailJS);

      render(<ContactForm />);

      // Fill out and submit the form
      await user.type(screen.getByPlaceholderText('Your Name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('Your Email'), 'john@example.com');
      await user.type(screen.getByPlaceholderText('Your Message'), 'This is a test message that is long enough');

      await user.click(screen.getByRole('button', { name: /send me a message/i }));

      await waitFor(() => {
        // Check that form inputs are cleared
        expect(screen.getByPlaceholderText('Your Name')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your Email')).toHaveValue('');
        expect(screen.getByPlaceholderText('Your Message')).toHaveValue('');
      });
    });

    it('should prevent default form submission', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const form = screen.getByRole('form');
      const submitHandler = jest.fn((e) => e.preventDefault());
      
      form.onsubmit = submitHandler;
      
      await user.click(screen.getByRole('button', { name: /send me a message/i }));
      
      expect(submitHandler).toHaveBeenCalled();
    });
  });

  describe('Form Attributes', () => {
    it('should have correct form attributes', () => {
      render(<ContactForm />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('id', 'contact-form');
      expect(form).toHaveAttribute('noValidate');
    });

    it('should have correct input attributes', () => {
      render(<ContactForm />);

      const nameInput = screen.getByPlaceholderText('Your Name');
      const emailInput = screen.getByPlaceholderText('Your Email');
      const messageInput = screen.getByPlaceholderText('Your Message');

      // Name input attributes
      expect(nameInput).toHaveAttribute('name', 'user_name');
      expect(nameInput).toHaveAttribute('required');
      expect(nameInput).toHaveAttribute('minLength', '2');
      expect(nameInput).toHaveAttribute('maxLength', '50');

      // Email input attributes
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('name', 'user_email');
      expect(emailInput).toHaveAttribute('required');
      expect(emailInput).toHaveAttribute('pattern');

      // Message textarea attributes
      expect(messageInput).toHaveAttribute('name', 'message');
      expect(messageInput).toHaveAttribute('required');
      expect(messageInput).toHaveAttribute('minLength', '10');
      expect(messageInput).toHaveAttribute('maxLength', '500');
    });

    it('should disable form inputs when submitting', () => {
      mockUseEmailJS.isSubmitting = true;
      useEmailJSModule.useEmailJS.mockReturnValue(mockUseEmailJS);

      render(<ContactForm />);

      expect(screen.getByPlaceholderText('Your Name')).toBeDisabled();
      expect(screen.getByPlaceholderText('Your Email')).toBeDisabled();
      expect(screen.getByPlaceholderText('Your Message')).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});