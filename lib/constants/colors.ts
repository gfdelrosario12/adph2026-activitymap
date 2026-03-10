/**
 * Color Constants - Arduino Day Philippines Theme
 * Primary: Arduino Green
 * Secondary: Philippine Flag Colors
 */

export const COLORS = {
  // Primary Arduino Green Theme
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Main Green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Arduino Brand Colors
  arduino: {
    teal: '#00979D',
    orange: '#E47128',
    darkTeal: '#006468',
    green: '#22c55e',
  },
  
  // Venue Type Colors (Arduino themed with green)
  venue: {
    lab: '#10b981',        // Emerald 500 - Labs & Technology
    workshop: '#059669',   // Emerald 600 - Workshops & Training
    event: '#22c55e',      // Green 500 - Event Spaces
    classroom: '#15803d',  // Green 700 - Classrooms & Facilities
  },
  
  // UI Colors
  background: {
    primary: '#0f172a',    // Slate 900
    secondary: '#1e293b',  // Slate 800
    tertiary: '#334155',   // Slate 700
  },
  
  // Status Colors
  status: {
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const

export type ColorPalette = typeof COLORS
