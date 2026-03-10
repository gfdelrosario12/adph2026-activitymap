'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Building3D from '@/components/Building3D'
import VenueDrawer from '@/components/VenueDrawer'
import { motion } from 'framer-motion'
import { ChevronLeft, Filter, Menu, X } from 'lucide-react'
import { Venue, Activity, Floor } from '@/lib/types'
import { getVenuesByFloor, getActivitiesByVenue } from '@/lib/utils/helpers'

function ActivityMapContent() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [floors, setFloors] = useState<Floor[]>([])
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [currentFloor, setCurrentFloor] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, activitiesRes, floorsRes] = await Promise.all([
          fetch('/data/venues-apc.json'),
          fetch('/data/activities.json'),
          fetch('/data/floors.json'),
        ])

        const venuesData = await venuesRes.json()
        const activitiesData = await activitiesRes.json()
        const floorsData = await floorsRes.json()

        setVenues(venuesData)
        setActivities(activitiesData)
        setFloors(floorsData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const currentFloorVenues = getVenuesByFloor(venues, currentFloor)
  const selectedVenueData = venues.find((v) => v.id === selectedVenue)
  const venueActivities = selectedVenueData ? getActivitiesByVenue(activities, selectedVenueData.id) : []

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header with Hamburger Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-slate-700 bg-slate-800 bg-opacity-50 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20 relative"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Go back home"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Venue Map</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              {floors[currentFloor]?.name || 'Loading...'}
            </p>
          </div>
        </div>

        {/* Desktop Filter Button */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            aria-label="Filter venues"
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Filter className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-white hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-800 border-b border-slate-700 shadow-lg sm:hidden z-50">
            <div className="p-4 flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to 3D Map</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all active:scale-95"
              >
                <Filter className="w-5 h-5" />
                <span className="text-sm font-medium">Filter Venues</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-slate-400">Loading map...</div>
        </div>
      ) : (
        <div className="flex-1 flex">
          {/* 3D Canvas */}
          <div className="flex-1 relative">
            <Building3D
              venues={currentFloorVenues}
              selectedVenue={selectedVenue}
              onVenueClick={setSelectedVenue}
              currentFloor={currentFloor}
            />

            {/* Floor Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-6 left-6 flex gap-2"
            >
              {floors.map((floor) => (
                <button
                  key={floor.level}
                  onClick={() => setCurrentFloor(floor.level)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentFloor === floor.level
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {floor.name}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Venue List Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Venues</h2>
              <div className="space-y-2">
                {currentFloorVenues.map((venue) => (
                  <motion.button
                    key={venue.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedVenue(venue.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedVenue === venue.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="font-semibold">{venue.name}</div>
                    <div className="text-xs opacity-75">{venue.capacity} capacity</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Venue Drawer */}
      <VenueDrawer
        venue={selectedVenueData || null}
        activities={venueActivities}
        isOpen={!!selectedVenue}
        onClose={() => setSelectedVenue(null)}
      />
    </div>
  )
}

export default function ActivityMapPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-900 flex items-center justify-center">Loading...</div>}>
      <ActivityMapContent />
    </Suspense>
  )
}
