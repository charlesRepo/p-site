/**
 * Particles.js configuration for background animation
 * Defines the visual properties and behavior of particle effects
 */
export const particlesOptions = {
  particles: {
    // Number and density of particles
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    // Particle appearance
    color: {
      value: '#ffffff',
    },
    shape: {
      type: 'circle',
    },
    // Opacity animation settings
    opacity: {
      value: 0.5,
      random: false,
      animation: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    // Size animation settings
    size: {
      value: 3,
      random: true,
      animation: {
        enable: true,
        speed: 2,
        size_min: 0.1,
        sync: false,
      },
    },
    // Lines connecting particles
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1,
    },
    // Movement behavior
    move: {
      enable: true,
      speed: 2,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  // User interaction settings
  interactivity: {
    detectsOn: 'canvas',
    events: {
      // Hover effect
      onHover: {
        enable: true,
        mode: 'grab',
      },
      // Click effect
      onClick: {
        enable: true,
        mode: 'push',
      },
      resize: true,
    },
    modes: {
      // Hover interaction mode
      grab: {
        distance: 140,
        line_linked: {
          opacity: 1,
        },
      },
      // Click interaction mode
      push: {
        particles_nb: 4,
      },
    },
  },
};