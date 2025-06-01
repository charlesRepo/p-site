import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../useFormValidation';
import { ERROR_MESSAGES } from '../../constants';

describe('useFormValidation', () => {
  let result;

  beforeEach(() => {
    const { result: hookResult } = renderHook(() => useFormValidation());
    result = hookResult;
  });

  describe('validateField', () => {
    it('should validate name field correctly', () => {
      let isValid;
      
      act(() => {
        // Valid name
        isValid = result.current.validateField('user_name', 'John Doe');
      });
      expect(isValid).toBe(true);
      expect(result.current.formError).toBe('');

      act(() => {
        // Invalid name (too short)
        isValid = result.current.validateField('user_name', 'J');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);

      act(() => {
        // Empty name
        isValid = result.current.validateField('user_name', '');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);

      act(() => {
        // Name with only spaces
        isValid = result.current.validateField('user_name', '   ');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);
    });

    it('should validate email field correctly', () => {
      let isValid;
      
      act(() => {
        // Valid email
        isValid = result.current.validateField('user_email', 'test@example.com');
      });
      expect(isValid).toBe(true);
      expect(result.current.formError).toBe('');

      act(() => {
        // Invalid email format
        isValid = result.current.validateField('user_email', 'invalid-email');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.INVALID_EMAIL);

      act(() => {
        // Empty email
        isValid = result.current.validateField('user_email', '');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.INVALID_EMAIL);

      act(() => {
        // Email with spaces
        isValid = result.current.validateField('user_email', 'test @example.com');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.INVALID_EMAIL);
    });

    it('should validate message field correctly', () => {
      let isValid;
      
      act(() => {
        // Valid message
        isValid = result.current.validateField('message', 'This is a valid message with enough characters');
      });
      expect(isValid).toBe(true);
      expect(result.current.formError).toBe('');

      act(() => {
        // Invalid message (too short)
        isValid = result.current.validateField('message', 'Short');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.MESSAGE_TOO_SHORT);

      act(() => {
        // Empty message
        isValid = result.current.validateField('message', '');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.MESSAGE_TOO_SHORT);

      act(() => {
        // Message with only spaces
        isValid = result.current.validateField('message', '          ');
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.MESSAGE_TOO_SHORT);
    });

    it('should return true for unknown field types', () => {
      let isValid;
      
      act(() => {
        isValid = result.current.validateField('unknown_field', 'any value');
      });
      expect(isValid).toBe(true);
      expect(result.current.formError).toBe('');
    });

    it('should clear previous errors when validating', () => {
      act(() => {
        // Set an error first
        result.current.validateField('user_name', 'J');
      });
      expect(result.current.formError).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);

      act(() => {
        // Validate a valid field - should clear error
        result.current.validateField('user_email', 'test@example.com');
      });
      expect(result.current.formError).toBe('');
    });
  });

  describe('validateAllFields', () => {
    it('should validate all fields successfully', () => {
      let isValid;
      
      act(() => {
        const formData = {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a valid message with enough characters'
        };
        isValid = result.current.validateAllFields(formData);
      });
      expect(isValid).toBe(true);
      expect(result.current.formError).toBe('');
    });

    it('should return false if name is invalid', () => {
      let isValid;
      
      act(() => {
        const formData = {
          name: 'J',
          email: 'john@example.com',
          message: 'This is a valid message with enough characters'
        };
        isValid = result.current.validateAllFields(formData);
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);
    });

    it('should return false if email is invalid', () => {
      let isValid;
      
      act(() => {
        const formData = {
          name: 'John Doe',
          email: 'invalid-email',
          message: 'This is a valid message with enough characters'
        };
        isValid = result.current.validateAllFields(formData);
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.INVALID_EMAIL);
    });

    it('should return false if message is invalid', () => {
      let isValid;
      
      act(() => {
        const formData = {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Short'
        };
        isValid = result.current.validateAllFields(formData);
      });
      expect(isValid).toBe(false);
      expect(result.current.formError).toBe(ERROR_MESSAGES.MESSAGE_TOO_SHORT);
    });
  });

  describe('clearError', () => {
    it('should clear form errors', () => {
      act(() => {
        // Set an error first
        result.current.validateField('user_name', 'J');
      });
      expect(result.current.formError).toBe(ERROR_MESSAGES.NAME_TOO_SHORT);

      act(() => {
        // Clear the error
        result.current.clearError();
      });
      expect(result.current.formError).toBe('');
    });
  });

  describe('setFormError', () => {
    it('should set custom error messages', () => {
      act(() => {
        result.current.setFormError('Custom error message');
      });
      expect(result.current.formError).toBe('Custom error message');
    });
  });
});