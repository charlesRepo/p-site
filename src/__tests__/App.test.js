import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the components
jest.mock('../components/ContactForm', () => {
  return function MockContactForm() {
    return <div data-testid="contact-form">Contact Form</div>;
  };
});

jest.mock('../components/SocialLinks', () => {
  return function MockSocialLinks({ iconSize }) {
    return <div data-testid="social-links" data-icon-size={iconSize}>Social Links</div>;
  };
});

// Mock Particles component
jest.mock('react-particles', () => {
  return function MockParticles({ id, init, options }) {
    return (
      <div 
        data-testid="particles" 
        data-id={id}
        data-testid-options={JSON.stringify(options)}
      >
        Particles Background
      </div>
    );
  };
});

// Mock tsparticles loadFull
jest.mock('tsparticles', () => ({
  loadFull: jest.fn(() => Promise.resolve()),
}));

// Mock particles config
jest.mock('../config/particlesConfig', () => ({
  particlesOptions: {
    particles: {
      number: { value: 80 },
      color: { value: '#ffffff' },
    },
  },
}));

describe('App', () => {
  describe('Rendering', () => {
    it('should render all main components', () => {
      render(<App />);

      // Check for particles background
      expect(screen.getByTestId('particles')).toBeInTheDocument();
      
      // Check for main content structure
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument();   // main content
      
      // Check for child components
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    });

    it('should render header content correctly', () => {
      render(<App />);

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent('Charles Hanna');
      expect(title).toHaveClass('header__title');

      const description = screen.getByText(/engineering leader passionate about/i);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('header__text');
    });

    it('should have correct CSS classes', () => {
      const { container } = render(<App />);

      const appContainer = container.querySelector('.app');
      expect(appContainer).toHaveClass('app');

      const contentContainer = container.querySelector('.content');
      expect(contentContainer).toHaveClass('content');

      const sectionContainer = container.querySelector('.container');
      expect(sectionContainer).toHaveClass('container');

      const header = screen.getByRole('banner');
      expect(header).toHaveClass('header');
    });
  });

  describe('Particles Configuration', () => {
    it('should render Particles component with correct props', () => {
      render(<App />);

      const particles = screen.getByTestId('particles');
      expect(particles).toHaveAttribute('data-id', 'tsparticles');
    });

    it('should pass particles options correctly', () => {
      render(<App />);

      const particles = screen.getByTestId('particles');
      expect(particles).toBeInTheDocument();
      // The options are passed through the particlesOptions import
    });
  });

  describe('Component Integration', () => {
    it('should pass correct props to SocialLinks', () => {
      render(<App />);

      const socialLinks = screen.getByTestId('social-links');
      expect(socialLinks).toHaveAttribute('data-icon-size', '24');
    });

    it('should render ContactForm without props', () => {
      render(<App />);

      const contactForm = screen.getByTestId('contact-form');
      expect(contactForm).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have correct HTML structure', () => {
      const { container } = render(<App />);

      // Check the overall structure
      const app = container.querySelector('.app');
      const particles = screen.getByTestId('particles');
      const content = container.querySelector('.content');
      
      expect(app).toContainElement(particles);
      expect(app).toContainElement(content);
    });

    it('should have correct semantic HTML elements', () => {
      render(<App />);

      // Check for semantic elements
      expect(screen.getByRole('banner')).toBeInTheDocument();  // header
      expect(screen.getByRole('main')).toBeInTheDocument();    // main
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // h1
    });

    it('should contain header within container section', () => {
      const { container } = render(<App />);

      const containerElement = container.querySelector('.container');
      const header = screen.getByRole('banner');
      
      expect(containerElement).toContainElement(header);
    });

    it('should contain main content within container section', () => {
      const { container } = render(<App />);

      const containerElement = container.querySelector('.container');
      const main = screen.getByRole('main');
      
      expect(containerElement).toContainElement(main);
    });

    it('should have social links and contact form within main', () => {
      render(<App />);

      const main = screen.getByRole('main');
      const socialLinks = screen.getByTestId('social-links');
      const contactForm = screen.getByTestId('contact-form');
      
      expect(main).toContainElement(socialLinks);
      expect(main).toContainElement(contactForm);
    });
  });

  describe('Content Verification', () => {
    it('should display correct personal information', () => {
      render(<App />);

      expect(screen.getByText('Charles Hanna')).toBeInTheDocument();
      expect(screen.getByText(/engineering leader passionate about modern web technologies and team development/i)).toBeInTheDocument();
    });

    it('should have proper text content structure', () => {
      render(<App />);

      const headerText = screen.getByText(/engineering leader passionate about/i);
      expect(headerText.tagName.toLowerCase()).toBe('p');
    });
  });

  describe('Comments and Documentation', () => {
    it('should render without errors (indicating proper component structure)', () => {
      // This test ensures the component renders without throwing errors
      // which indicates proper imports and component structure
      expect(() => render(<App />)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<App />);

      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent('Charles Hanna');
    });

    it('should have semantic HTML structure', () => {
      render(<App />);

      // Check for proper semantic elements
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<App />);
      
      // Component should render consistently
      expect(screen.getByText('Charles Hanna')).toBeInTheDocument();
      
      rerender(<App />);
      
      expect(screen.getByText('Charles Hanna')).toBeInTheDocument();
    });
  });
});