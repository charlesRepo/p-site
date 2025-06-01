/**
 * Application constants and configuration values
 */

// EmailJS configuration
export const EMAILJS_CONFIG = {
  USER_ID: '4hERTpScUingY1-Ur',
  SERVICE_ID: 'service_zajkv1e',
  TEMPLATE_ID: 'template_3h1f71a',
};

// Form validation constants
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 500,
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NAME_TOO_SHORT: 'Name must be at least 2 characters long',
  INVALID_EMAIL: 'Please enter a valid email address',
  MESSAGE_TOO_SHORT: 'Message must be at least 10 characters long',
  SEND_FAILED: 'Failed to send message. Please try again.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  MESSAGE_SENT: 'Thank you for your message! I will get back to you as soon as possible.',
};

// Social media links
export const SOCIAL_LINKS = [
  {
    href: 'https://www.linkedin.com/in/chrls/',
    icon: 'FaLinkedin',
    label: 'LinkedIn Profile',
  },
  {
    href: 'https://github.com/charlesRepo',
    icon: 'FaGithub',
    label: 'GitHub Profile',
  },
  {
    href: 'https://codepen.io/chrls/',
    icon: 'FaCodepen',
    label: 'CodePen Profile',
  },
  {
    href: 'https://www.behance.net/chrls',
    icon: 'FaBehance',
    label: 'Behance Portfolio',
  },
];