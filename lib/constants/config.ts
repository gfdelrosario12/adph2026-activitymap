/**
 * Application Configuration
 * Centralized configuration for Arduino Day Philippines 2026
 */

export const APP_CONFIG = {
  // Application Info
  app: {
    name: 'Arduino Day Philippines 2026',
    shortName: 'ADP 2026',
    description: 'Explore interactive 3D venues, watch live streams, and discover the future of open-source hardware at Arduino Day Philippines 2026',
    version: '1.0.0',
    year: 2026,
  },

  // Building Configuration
  building: {
    name: 'Asia Pacific College',
    floors: 12,
    floorHeight: 4,
    width: 55,
    depth: 55,
  },

  // 3D Rendering Configuration
  rendering: {
    desktop: {
      shadows: true,
      dpr: [1, 2] as [number, number],
      fov: 55,
      cameraPosition: [70, 35, 70] as [number, number, number],
      lightCount: 5,
      shadowMapSize: 4096,
      maxDistance: 180,
      minDistance: 30,
    },
    mobile: {
      shadows: false,
      dpr: [1, 1.5] as [number, number],
      fov: 65,
      cameraPosition: [90, 45, 90] as [number, number, number],
      lightCount: 2,
      shadowMapSize: 2048,
      maxDistance: 200,
      minDistance: 40,
    },
    topView: {
      cameraPosition: [0, 100, 0.01] as [number, number, number],
      fov: 70,
      maxDistance: 120,
      minDistance: 50,
    },
  },

  // Performance Settings
  performance: {
    adaptiveMin: 0.5,
    mobileBreakpoint: 768,
  },

  // Routes
  routes: {
    home: '/',
    activityMap: '/activity-map',
    livestreams: '/livestreams',
  },
} as const

export type AppConfig = typeof APP_CONFIG
