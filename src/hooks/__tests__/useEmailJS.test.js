import { renderHook, act } from '@testing-library/react';
import { useEmailJS } from '../useEmailJS';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';

// Mock EmailJS
jest.mock('@emailjs/browser', () => ({
  init: jest.fn(),
  send: jest.fn(),
}));

describe('useEmailJS', () => {
  let result;

  beforeEach(() => {
    jest.clearAllMocks();
    const { result: hookResult } = renderHook(() => useEmailJS());
    result = hookResult;
  });

  describe('initialization', () => {
    it('should initialize EmailJS on mount', () => {
      renderHook(() => useEmailJS());
      expect(emailjs.init).toHaveBeenCalledWith(EMAILJS_CONFIG.USER_ID);
    });

    it('should have correct initial state', () => {
      expect(result.current.formSuccess).toBe('');
      expect(result.current.showForm).toBe(true);
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('sendEmail', () => {
    const mockFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message that is long enough to be valid'
    };

    const mockOnError = jest.fn();

    beforeEach(() => {
      mockOnError.mockClear();
    });

    it('should send email successfully', async () => {
      emailjs.send.mockResolvedValueOnce({ status: 200 });

      await act(async () => {
        const success = await result.current.sendEmail(mockFormData, mockOnError);
        expect(success).toBe(true);
      });

      expect(emailjs.send).toHaveBeenCalledWith(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: mockFormData.name,
          to_name: 'Charles Hanna',
          reply_to: mockFormData.email,
          message: mockFormData.message,
        },
        EMAILJS_CONFIG.USER_ID
      );

      expect(result.current.showForm).toBe(false);
      expect(result.current.formSuccess).toBe(SUCCESS_MESSAGES.MESSAGE_SENT);
      expect(result.current.isSubmitting).toBe(false);
      expect(mockOnError).not.toHaveBeenCalled();
    });

    it('should handle email sending failure', async () => {
      const mockError = new Error('Network error');
      emailjs.send.mockRejectedValueOnce(mockError);

      let success;
      await act(async () => {
        success = await result.current.sendEmail(mockFormData, mockOnError);
      });

      expect(success).toBe(false);
      expect(mockOnError).toHaveBeenCalledWith(ERROR_MESSAGES.SEND_FAILED);
      expect(result.current.formSuccess).toBe('');
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.showForm).toBe(true); // Should remain true on error
    });

    it('should set isSubmitting state correctly during submission', async () => {
      emailjs.send.mockResolvedValueOnce({ status: 200 });

      await act(async () => {
        const sendEmailPromise = result.current.sendEmail(mockFormData, mockOnError);
        await sendEmailPromise;
      });

      // After completion, isSubmitting should be false
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should prepare email data correctly', async () => {
      emailjs.send.mockResolvedValueOnce({ status: 200 });

      await act(async () => {
        await result.current.sendEmail(mockFormData, mockOnError);
      });

      const expectedEmailData = {
        from_name: 'John Doe',
        to_name: 'Charles Hanna',
        reply_to: 'john@example.com',
        message: 'Test message that is long enough to be valid',
      };

      expect(emailjs.send).toHaveBeenCalledWith(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        expectedEmailData,
        EMAILJS_CONFIG.USER_ID
      );
    });

    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Test error');
      emailjs.send.mockRejectedValueOnce(mockError);

      await act(async () => {
        await result.current.sendEmail(mockFormData, mockOnError);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error sending email:', mockError);
      consoleSpy.mockRestore();
    });
  });

  describe('resetForm', () => {
    it('should reset form to initial state', async () => {
      // First simulate a successful submission
      emailjs.send.mockResolvedValueOnce({ status: 200 });
      await act(async () => {
        await result.current.sendEmail({
          name: 'John',
          email: 'john@example.com',
          message: 'Test message that is long enough'
        }, jest.fn());
      });

      // Verify form is in success state
      expect(result.current.showForm).toBe(false);
      expect(result.current.formSuccess).toBe(SUCCESS_MESSAGES.MESSAGE_SENT);

      // Reset the form
      act(() => {
        result.current.resetForm();
      });

      // Verify form is back to initial state
      expect(result.current.showForm).toBe(true);
      expect(result.current.formSuccess).toBe('');
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});