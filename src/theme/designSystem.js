// Design System - Modern UI Constants

export const colors = {
    primary: {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        main: '#667eea',
        dark: '#764ba2',
        light: '#8b9aee',
        lighter: '#e8ebfa',
    },
    secondary: {
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        main: '#f093fb',
        dark: '#f5576c',
    },
    success: {
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        main: '#4facfe',
        dark: '#00f2fe',
    },
    warning: {
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        main: '#fa709a',
        dark: '#fee140',
    },
    error: {
        gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        main: '#ff6b6b',
        dark: '#ee5a6f',
    },
    info: {
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        main: '#30cfd0',
        dark: '#330867',
    },
};

export const shadows = {
    sm: '0 2px 8px rgba(0,0,0,0.08)',
    md: '0 4px 12px rgba(0,0,0,0.12)',
    lg: '0 8px 24px rgba(0,0,0,0.15)',
    xl: '0 12px 32px rgba(0,0,0,0.18)',
    colored: (color) => `0 8px 24px ${color}40`,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const typography = {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    weights: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },
};

export const animations = {
    duration: {
        fast: '0.2s',
        normal: '0.3s',
        slow: '0.5s',
    },
    easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
};

export const backgrounds = {
    subtle: 'radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)',
    gradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
    mesh: `
    radial-gradient(at 40% 20%, rgba(102, 126, 234, 0.1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(118, 75, 162, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(102, 126, 234, 0.1) 0px, transparent 50%),
    radial-gradient(at 80% 50%, rgba(118, 75, 162, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(102, 126, 234, 0.1) 0px, transparent 50%),
    radial-gradient(at 80% 100%, rgba(118, 75, 162, 0.1) 0px, transparent 50%)
  `,
};
