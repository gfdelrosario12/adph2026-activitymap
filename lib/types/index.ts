/**
 * TypeScript Type Definitions
 * Centralized type definitions for the application
 */

export interface Venue {
  id: string
  name: string
  floor: number
  position: {
    x: number
    y: number
    z: number
  }
  size: {
    width: number
    height: number
    depth: number
  }
  capacity: number
  color: string
  type?: 'lab' | 'workshop' | 'event' | 'classroom'
  description?: string
}

export interface Activity {
  id: string
  title: string
  venue: string
  startTime: string
  endTime: string
  speaker: string
  description: string
  category: string
  capacity: number
  registered: number
}

export interface Floor {
  id: string
  name: string
  level: number
}

export interface LiveStream {
  id: string
  title: string
  speaker: string
  thumbnail: string
  viewers: number
  status: 'live' | 'upcoming' | 'ended'
  venue: string
  startTime: string
  description: string
  youtubeUrl?: string
  embedUrl?: string
  activity?: string
  quality?: string
}

export type ViewMode = 'perspective' | 'top'

export interface VenueType {
  id: string
  name: string
  color: string
  icon?: string
}
