/**
 * Utility Functions
 * Reusable helper functions following DRY principles
 */

import { Venue, Activity, Floor, LiveStream } from '../types'

/**
 * Get venues for a specific floor
 */
export const getVenuesByFloor = (venues: Venue[], floorLevel: number): Venue[] => {
  return venues.filter(venue => venue.floor === floorLevel)
}

/**
 * Get activities for a specific venue
 */
export const getActivitiesByVenue = (activities: Activity[], venueId: string): Activity[] => {
  return activities.filter(activity => activity.venue === venueId)
}

/**
 * Generate floor list from floor count
 */
export const generateFloors = (count: number): Floor[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `floor-${i}`,
    name: i === 0 ? 'Ground Floor' : i === count - 1 ? 'Top Floor' : `Floor ${i + 1}`,
    level: i,
  }))
}

/**
 * Format time for display
 */
export const formatTime = (time: string): string => {
  return time
}

/**
 * Get venue type label
 */
export const getVenueTypeLabel = (color: string): string => {
  const colorMap: Record<string, string> = {
    '#10b981': 'Lab',
    '#059669': 'Workshop',
    '#22c55e': 'Event',
    '#15803d': 'Facility',
    // Legacy colors for backward compatibility
    '#00979D': 'Lab',
    '#E47128': 'Event',
    '#006468': 'Class',
  }
  return colorMap[color] || 'Unknown'
}

/**
 * Check if device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

/**
 * Clamp number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate venue average size for square rendering
 */
export const getVenueSquareSize = (venue: Venue) => {
  const avgSize = (venue.size.width + venue.size.depth) / 2
  return {
    width: avgSize,
    height: venue.size.height,
    depth: avgSize,
  }
}

/**
 * Check if venue is a comfort room
 */
export const isComfortRoom = (venue: Venue): boolean => {
  return venue.name.toLowerCase().includes('comfort room') || 
         venue.name.toLowerCase().includes('restroom') ||
         venue.name.toLowerCase().includes('cr')
}

/**
 * Check if venue is restricted access
 */
export const isRestrictedAccess = (venue: Venue): boolean => {
  return venue.description?.toLowerCase().includes('restricted') ||
         venue.description?.toLowerCase().includes('not allowed') ||
         venue.name.toLowerCase().includes('stock room')
}

/**
 * Get venue category badge text
 */
export const getVenueCategoryBadge = (venue: Venue): string => {
  if (isComfortRoom(venue)) return '🚻 Comfort Room'
  if (isRestrictedAccess(venue)) return '🔒 Restricted'
  return getVenueTypeLabel(venue.color)
}

/**
 * Get livestreams for a specific activity
 */
export const getStreamsByActivity = (streams: LiveStream[], activityId: string): LiveStream[] => {
  return streams.filter(stream => stream.activity === activityId)
}

/**
 * Get livestreams for a specific venue
 */
export const getStreamsByVenue = (streams: LiveStream[], venueId: string): LiveStream[] => {
  return streams.filter(stream => stream.venue === venueId)
}

/**
 * Check if activity has live stream
 */
export const hasLiveStream = (streams: LiveStream[], activityId: string): boolean => {
  return streams.some(stream => stream.activity === activityId && stream.status === 'live')
}
