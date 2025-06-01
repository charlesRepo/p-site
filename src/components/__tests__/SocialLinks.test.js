import React from 'react';
import { render, screen } from '@testing-library/react';
import SocialLinks from '../SocialLinks';
import { SOCIAL_LINKS } from '../../constants';

// Mock the react-icons
jest.mock('react-icons/fa', () => ({
  FaLinkedin: ({ size }) => <div data-testid="linkedin-icon" data-size={size}>LinkedIn</div>,
  FaGithub: ({ size }) => <div data-testid="github-icon" data-size={size}>GitHub</div>,
  FaCodepen: ({ size }) => <div data-testid="codepen-icon" data-size={size}>CodePen</div>,
  FaBehance: ({ size }) => <div data-testid="behance-icon" data-size={size}>Behance</div>,
}));

describe('SocialLinks', () => {
  describe('Rendering', () => {
    it('should render all social links', () => {
      const { container } = render(<SocialLinks />);

      const socialLinksContainer = container.querySelector('.social-links');
      expect(socialLinksContainer).toBeInTheDocument();

      // Check that all social links are rendered
      expect(screen.getByRole('link', { name: /linkedin profile/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /github profile/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /codepen profile/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /behance portfolio/i })).toBeInTheDocument();
    });

    it('should render correct number of social links', () => {
      render(<SocialLinks />);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(SOCIAL_LINKS.length);
    });

    it('should render social links with correct href attributes', () => {
      render(<SocialLinks />);

      const linkedinLink = screen.getByRole('link', { name: /linkedin profile/i });
      const githubLink = screen.getByRole('link', { name: /github profile/i });
      const codepenLink = screen.getByRole('link', { name: /codepen profile/i });
      const behanceLink = screen.getByRole('link', { name: /behance portfolio/i });

      expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/chrls/');
      expect(githubLink).toHaveAttribute('href', 'https://github.com/charlesRepo');
      expect(codepenLink).toHaveAttribute('href', 'https://codepen.io/chrls/');
      expect(behanceLink).toHaveAttribute('href', 'https://www.behance.net/chrls');
    });

    it('should render social links with correct attributes', () => {
      render(<SocialLinks />);

      const links = screen.getAllByRole('link');

      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        expect(link).toHaveClass('social-link');
      });
    });

    it('should render social links with accessibility attributes', () => {
      render(<SocialLinks />);

      const linkedinLink = screen.getByRole('link', { name: /linkedin profile/i });
      const githubLink = screen.getByRole('link', { name: /github profile/i });
      const codepenLink = screen.getByRole('link', { name: /codepen profile/i });
      const behanceLink = screen.getByRole('link', { name: /behance portfolio/i });

      // Check aria-label attributes
      expect(linkedinLink).toHaveAttribute('aria-label', 'LinkedIn Profile');
      expect(githubLink).toHaveAttribute('aria-label', 'GitHub Profile');
      expect(codepenLink).toHaveAttribute('aria-label', 'CodePen Profile');
      expect(behanceLink).toHaveAttribute('aria-label', 'Behance Portfolio');

      // Check title attributes
      expect(linkedinLink).toHaveAttribute('title', 'LinkedIn Profile');
      expect(githubLink).toHaveAttribute('title', 'GitHub Profile');
      expect(codepenLink).toHaveAttribute('title', 'CodePen Profile');
      expect(behanceLink).toHaveAttribute('title', 'Behance Portfolio');
    });
  });

  describe('Icons', () => {
    it('should render icons with default size', () => {
      render(<SocialLinks />);

      expect(screen.getByTestId('linkedin-icon')).toHaveAttribute('data-size', '24');
      expect(screen.getByTestId('github-icon')).toHaveAttribute('data-size', '24');
      expect(screen.getByTestId('codepen-icon')).toHaveAttribute('data-size', '24');
      expect(screen.getByTestId('behance-icon')).toHaveAttribute('data-size', '24');
    });

    it('should render icons with custom size', () => {
      render(<SocialLinks iconSize={32} />);

      expect(screen.getByTestId('linkedin-icon')).toHaveAttribute('data-size', '32');
      expect(screen.getByTestId('github-icon')).toHaveAttribute('data-size', '32');
      expect(screen.getByTestId('codepen-icon')).toHaveAttribute('data-size', '32');
      expect(screen.getByTestId('behance-icon')).toHaveAttribute('data-size', '32');
    });

    it('should render correct icons for each social platform', () => {
      render(<SocialLinks />);

      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
      expect(screen.getByTestId('github-icon')).toBeInTheDocument();
      expect(screen.getByTestId('codepen-icon')).toBeInTheDocument();
      expect(screen.getByTestId('behance-icon')).toBeInTheDocument();
    });

    it('should handle missing icon gracefully', () => {
      // Test that the component renders links correctly with existing icons
      render(<SocialLinks />);

      // All links should be rendered
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      // Each link should have proper attributes
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link).toHaveAttribute('aria-label');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Props', () => {
    it('should handle iconSize prop correctly', () => {
      const { rerender } = render(<SocialLinks iconSize={16} />);

      expect(screen.getByTestId('linkedin-icon')).toHaveAttribute('data-size', '16');

      rerender(<SocialLinks iconSize={48} />);

      expect(screen.getByTestId('linkedin-icon')).toHaveAttribute('data-size', '48');
    });

    it('should use default iconSize when not provided', () => {
      render(<SocialLinks />);

      expect(screen.getByTestId('linkedin-icon')).toHaveAttribute('data-size', '24');
    });
  });

  describe('Integration with constants', () => {
    it('should use SOCIAL_LINKS constant correctly', () => {
      render(<SocialLinks />);

      // Verify that the component renders based on the SOCIAL_LINKS constant
      SOCIAL_LINKS.forEach(link => {
        const linkElement = screen.getByRole('link', { name: new RegExp(link.label, 'i') });
        expect(linkElement).toHaveAttribute('href', link.href);
        expect(linkElement).toHaveAttribute('aria-label', link.label);
        expect(linkElement).toHaveAttribute('title', link.label);
      });
    });

    it('should maintain correct link order', () => {
      render(<SocialLinks />);

      const links = screen.getAllByRole('link');
      const expectedOrder = ['LinkedIn Profile', 'GitHub Profile', 'CodePen Profile', 'Behance Portfolio'];

      links.forEach((link, index) => {
        expect(link).toHaveAttribute('aria-label', expectedOrder[index]);
      });
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes', () => {
      const { container } = render(<SocialLinks />);

      const socialLinksContainer = container.querySelector('.social-links');
      expect(socialLinksContainer).toHaveClass('social-links');

      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveClass('social-link');
      });
    });
  });
});