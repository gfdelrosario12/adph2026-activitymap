/**
 * Custom Hooks for Data Fetching
 * Centralized data loading with error handling
 */

import { useState, useEffect } from 'react'
import { Venue, Activity, Floor, LiveStream } from '../types'

/**
 * Hook to fetch venues data
 */
export const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/venues-apc.json')
        if (!response.ok) throw new Error('Failed to fetch venues')
        const data = await response.json()
        setVenues(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error loading venues:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [])

  return { venues, loading, error }
}

/**
 * Hook to fetch activities data
 */
export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/activities.json')
        if (!response.ok) throw new Error('Failed to fetch activities')
        const data = await response.json()
        setActivities(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error loading activities:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, loading, error }
}

/**
 * Hook to fetch floors data
 */
export const useFloors = () => {
  const [floors, setFloors] = useState<Floor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/floors.json')
        if (!response.ok) throw new Error('Failed to fetch floors')
        const data = await response.json()
        setFloors(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error loading floors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFloors()
  }, [])

  return { floors, loading, error }
}

/**
 * Hook to fetch livestreams data
 */
export const useLiveStreams = () => {
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data/livestreams.json')
        if (!response.ok) throw new Error('Failed to fetch livestreams')
        const data = await response.json()
        setStreams(data)
      } catch (err) {
        setError(err as Error)
        console.error('Error loading livestreams:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStreams()
  }, [])

  return { streams, loading, error }
}

/**
 * Hook to detect mobile device
 */
export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}
