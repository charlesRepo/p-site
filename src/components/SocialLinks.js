import React from 'react';
import { FaLinkedin, FaGithub, FaCodepen, FaBehance } from 'react-icons/fa';
import { SOCIAL_LINKS } from '../constants';

/**
 * Icon mapping for social media platforms
 * Maps icon names to their corresponding React icon components
 */
const iconMap = {
  FaLinkedin,
  FaGithub,
  FaCodepen,
  FaBehance,
};

/**
 * SocialLinks Component
 * Renders a list of social media links with icons
 * @param {Object} props - Component props
 * @param {number} props.iconSize - Size of the social media icons (default: 24)
 * @returns {JSX.Element} Social links component
 */
const SocialLinks = ({ iconSize = 24 }) => {
  return (
    <div className="social-links">
      {SOCIAL_LINKS.map((link, index) => {
        // Get the icon component from the icon map
        const IconComponent = iconMap[link.icon];
        
        return (
          <a
            key={index}
            className="social-link"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
          >
            {IconComponent && <IconComponent size={iconSize} />}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;