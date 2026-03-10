'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Building, Radio, ChevronUp, ChevronDown, Clock, Users, Menu, X, Layers, MapPin, PlayCircle } from 'lucide-react'
import Building3D from '@/components/Building3D'
import { useVenues, useActivities, useFloors } from '@/lib/hooks/useData'
import { getVenuesByFloor, getActivitiesByVenue, getVenueTypeLabel } from '@/lib/utils/helpers'
import { APP_CONFIG } from '@/lib/constants/config'
import StreamModal from '@/components/StreamModal'
import { LiveStream } from '@/lib/types'

export default function Home() {
  const [currentFloor, setCurrentFloor] = useState(0)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [floorMenuOpen, setFloorMenuOpen] = useState(false)
  const [venueMenuOpen, setVenueMenuOpen] = useState(false)
  const [quickNavOpen, setQuickNavOpen] = useState(false)
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [streams, setStreams] = useState<LiveStream[]>([])

  // Load data from JSON files using custom hooks
  const { venues, loading: venuesLoading } = useVenues()
  const { activities, loading: activitiesLoading } = useActivities()
  const { floors, loading: floorsLoading } = useFloors()

  // Load livestreams
  React.useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch('/data/livestreams.json')
        const data = await res.json()
        setStreams(data)
      } catch (error) {
        console.error('Error loading streams:', error)
      }
    }
    fetchStreams()
  }, [])

  const handleFloorChange = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentFloor < APP_CONFIG.building.floors - 1) {
      setCurrentFloor(currentFloor + 1)
    } else if (direction === 'down' && currentFloor > 0) {
      setCurrentFloor(currentFloor - 1)
    }
  }

  const currentFloorVenues = getVenuesByFloor(venues, currentFloor)
  const selectedVenueData = venues.find(v => v.id === selectedVenue)
  const hoveredVenueData = venues.find(v => v.id === hoveredVenue)
  const venueActivities = selectedVenueData ? getActivitiesByVenue(activities, selectedVenueData.id) : []

  // Helper function to get stream for an activity
  const getStreamForActivity = (activity: any) => {
    if (!activity.livestreamId) return null
    return streams.find(s => s.id === activity.livestreamId) || null
  }

  // Helper function to open stream modal
  const handleOpenStream = (streamId: string) => {
    const stream = streams.find(s => s.id === streamId)
    if (stream) {
      setSelectedStream(stream)
    }
  }

  // Show loading state
  if (venuesLoading || activitiesLoading || floorsLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 text-lg font-semibold">Loading {APP_CONFIG.app.name}...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="h-screen flex flex-col bg-slate-900 overflow-hidden">
      {/* Navigation - Responsive with Hamburger Menu */}
      <nav className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 backdrop-blur-md bg-slate-900 bg-opacity-90 border-b border-green-500/30 z-20 relative">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
          <Building className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          <span className="hidden sm:inline">Arduino Day Philippines 2026</span>
          <span className="sm:hidden">ADPH 2026</span>
        </h1>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3 md:gap-4">
          <div className="text-slate-400 text-sm">
            {currentFloorVenues.length} venues • {venues.length} total
          </div>
          <Link
            href="/livestreams"
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Radio className="w-4 h-4" />
            <span className="text-sm">Streams</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-900 border-b border-green-500/30 shadow-lg md:hidden z-50">
            <div className="flex flex-col p-4 gap-3">
              <div className="text-slate-400 text-sm text-center pb-2 border-b border-slate-700">
                {currentFloorVenues.length} venues • {venues.length} total
              </div>
              <Link
                href="/livestreams"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors active:scale-95"
              >
                <Radio className="w-5 h-5" />
                <span className="text-sm">View Livestreams</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* 3D Building */}
        <div className="absolute inset-0">
          <Building3D
            venues={venues}
            selectedVenue={selectedVenue}
            onVenueClick={setSelectedVenue}
            currentFloor={currentFloor}
            hoveredVenue={hoveredVenue}
            onVenueHover={setHoveredVenue}
          />
        </div>

        {/* Enhanced Hover Tooltip - Compact & Responsive */}
        {hoveredVenueData && hoveredVenue !== selectedVenue && (
          <div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 px-2 xs:px-3 sm:px-4 w-full max-w-[90vw] xs:max-w-[85vw] sm:max-w-md md:max-w-lg"
            style={{ 
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-2xl border-2 border-blue-500/60 rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm xs:text-base sm:text-lg md:text-xl flex items-center gap-2 mb-1">
                    <div 
                      className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 rounded-full animate-pulse shadow-lg flex-shrink-0" 
                      style={{ 
                        backgroundColor: hoveredVenueData.color,
                        boxShadow: `0 0 15px ${hoveredVenueData.color}`
                      }}
                    />
                    <span className="line-clamp-1 break-words">{hoveredVenueData.name}</span>
                  </h3>
                  <div className="text-slate-300 text-[10px] xs:text-xs sm:text-sm flex items-center gap-1">
                    <Building className="w-2.5 h-2.5 xs:w-3 xs:h-3 flex-shrink-0" />
                    <span className="truncate">{floors[hoveredVenueData.floor]?.name || `Floor ${hoveredVenueData.floor + 1}`}</span>
                  </div>
                </div>
                <div 
                  className="px-2 xs:px-2.5 sm:px-3 py-0.5 xs:py-1 rounded-md sm:rounded-lg text-[9px] xs:text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-lg flex-shrink-0"
                  style={{ 
                    backgroundColor: `${hoveredVenueData.color}40`,
                    color: hoveredVenueData.color,
                    border: `1.5px solid ${hoveredVenueData.color}80`,
                    boxShadow: `0 0 10px ${hoveredVenueData.color}40`
                  }}
                >
                  {getVenueTypeLabel(hoveredVenueData.color)}
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-3">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-2 xs:p-2.5 border border-blue-500/40 shadow-lg">
                  <div className="text-slate-400 text-[9px] xs:text-[10px] sm:text-xs mb-1 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                    <span>Capacity</span>
                  </div>
                  <div className="text-white font-bold text-lg xs:text-xl sm:text-2xl">
                    {hoveredVenueData.capacity}
                  </div>
                  <div className="text-slate-400 text-[8px] xs:text-[9px] sm:text-[10px]">people</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg p-2 xs:p-2.5 border border-purple-500/40 shadow-lg">
                  <div className="text-slate-400 text-[9px] xs:text-[10px] sm:text-xs mb-1">Size</div>
                  <div className="text-white font-bold text-base xs:text-lg sm:text-xl">
                    {hoveredVenueData.size.width.toFixed(0)} × {hoveredVenueData.size.depth.toFixed(0)}
                  </div>
                  <div className="text-slate-400 text-[8px] xs:text-[9px] sm:text-[10px]">meters</div>
                </div>
              </div>

              {/* Activities Section */}
              {getActivitiesByVenue(activities, hoveredVenueData.id).length > 0 && (
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-2 xs:p-2.5 border border-green-500/40 mb-2">
                  <div className="text-green-300 text-[10px] xs:text-xs sm:text-sm font-semibold mb-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                    <span>Active Sessions</span>
                  </div>
                  <div className="text-white text-sm xs:text-base sm:text-lg font-bold">
                    {getActivitiesByVenue(activities, hoveredVenueData.id).length} {getActivitiesByVenue(activities, hoveredVenueData.id).length === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
              )}

              {/* Action Prompt */}
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700/50 text-center">
                <p className="text-slate-400 text-[10px] xs:text-xs sm:text-sm font-medium">
                  👆 Click to view details
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Floor Controls + Quick Nav - Desktop only */}
        <div className="hidden md:flex flex-col items-center absolute left-6 top-1/2 -translate-y-1/2 z-30 space-y-3">
          {/* Floor Up / Floor Number / Floor Down */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-4 shadow-2xl flex flex-col items-center gap-3">
            <button
              onClick={() => handleFloorChange('up')}
              disabled={currentFloor >= 11}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:hover:scale-100 active:scale-95"
              title="Go up one floor"
            >
              <ChevronUp className="w-6 h-6" />
            </button>

            <div className="text-center py-2">
              <div className="text-white font-bold text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentFloor + 1}
              </div>
              <div className="text-slate-400 text-xs whitespace-nowrap mt-1">
                {floors[currentFloor]?.name || 'Floor'}
              </div>
            </div>

            <button
              onClick={() => handleFloorChange('down')}
              disabled={currentFloor <= 0}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-105 disabled:hover:scale-100 active:scale-95"
              title="Go down one floor"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Jump Button */}
          <button
            onClick={() => setQuickNavOpen(!quickNavOpen)}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg shadow-xl transition-all flex items-center justify-center gap-2 text-xs font-semibold hover:shadow-purple-500/50 hover:scale-105 active:scale-95 border border-purple-400/40"
            title={quickNavOpen ? "Close floor list" : "View all floors"}
          >
            <Layers className="w-4 h-4" />
            <span>{quickNavOpen ? 'Close List' : 'All Floors'}</span>
          </button>

          {/* Quick Navigation Dropdown */}
          {quickNavOpen && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-3 shadow-2xl max-h-[45vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700">
                <span className="text-white font-semibold text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Jump to Floor
                </span>
                <button
                  onClick={() => setQuickNavOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="space-y-1">
                {floors.map((floor, idx) => {
                  const floorVenueCount = venues.filter(v => v.floor === idx).length
                  return (
                    <button
                      key={floor.id}
                      onClick={() => {
                        setCurrentFloor(idx)
                        setQuickNavOpen(false)
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-all flex items-center justify-between group ${
                        currentFloor === idx
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md font-semibold'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{floor.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                        currentFloor === idx ? 'bg-white/20' : 'bg-slate-600 group-hover:bg-slate-500'
                      }`}>
                        {floorVenueCount}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Floor Controls - Unchanged */}
        <div className="md:hidden absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-2 sm:p-3 z-20 shadow-2xl">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleFloorChange('up')}
              disabled={currentFloor >= 11}
              className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-110 disabled:hover:scale-100 active:scale-95"
              title="Go up one floor"
            >
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="text-center py-1 sm:py-2">
              <div className="text-white font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {currentFloor + 1}
              </div>
              <div className="text-slate-400 text-[10px] sm:text-xs whitespace-nowrap mt-0.5 sm:mt-1">Floor</div>
            </div>
            <button
              onClick={() => handleFloorChange('down')}
              disabled={currentFloor <= 0}
              className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-110 disabled:hover:scale-100 active:scale-95"
              title="Go down one floor"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        {/* Venue Info Panel - Desktop only, full height available (hidden on mobile, replaced by drawer) */}
        <div className="hidden md:block absolute right-2 sm:right-4 md:right-6 top-2 sm:top-4 md:top-6 bottom-2 sm:bottom-4 md:bottom-6 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-3 sm:p-4 md:p-5 w-64 md:w-72 lg:w-80 z-20 shadow-2xl overflow-y-auto">
          <h2 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 sm:mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              {floors[currentFloor].name}
            </span>
          </h2>

          {/* Floor Summary - Highlight active venues */}
          <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border-2 border-blue-400/40">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-blue-300 text-xs sm:text-sm font-semibold">Active Venues</div>
              <div className="text-white text-lg sm:text-xl font-bold">{currentFloorVenues.length}</div>
            </div>
            <div className="text-slate-300 text-[10px] sm:text-xs">
              All venues highlighted in 3D view
            </div>
          </div>
          
          {selectedVenueData && venueActivities.length > 0 && (
            <div className="mb-2 sm:mb-3 p-2.5 sm:p-3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border-2 border-blue-500/40 shadow-lg">
              <h3 className="text-white font-bold mb-1.5 sm:mb-2 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                <span className="truncate">{selectedVenueData?.name}</span>
              </h3>
              <div className="space-y-1.5 sm:space-y-2">
                {venueActivities.map(activity => {
                  const activityStream = getStreamForActivity(activity)
                  return (
                    <div key={activity.id} className="text-xs sm:text-sm bg-slate-800/50 p-2 rounded-lg border border-slate-600/50">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-blue-300 font-semibold truncate">{activity.title}</div>
                          <div className="text-slate-300 text-[10px] sm:text-xs mt-0.5 truncate">{activity.speaker}</div>
                          <div className="flex items-center gap-2 text-slate-400 text-[10px] sm:text-xs mt-1.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span className="hidden sm:inline">{activity.startTime} - {activity.endTime}</span>
                              <span className="sm:hidden">{activity.startTime}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {activity.registered}/{activity.capacity}
                            </span>
                          </div>
                        </div>
                        {activityStream && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenStream(activityStream.id)
                            }}
                            className="flex-shrink-0 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-all transform hover:scale-110 active:scale-95 shadow-lg hover:shadow-red-500/50"
                            title="Watch livestream"
                          >
                            <PlayCircle className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                      {activityStream && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-400">
                          <Radio className="w-3 h-3 animate-pulse" />
                          <span className="font-semibold">{activityStream.status === 'live' ? 'STREAMING NOW' : 'Stream Available'}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="text-slate-400 text-[10px] sm:text-xs mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              {currentFloorVenues.length} venues visible
            </div>
            {currentFloorVenues.length > 0 ? (
              currentFloorVenues.map(venue => {
                const venueActivityCount = activities.filter(a => a.venue === venue.id).length
                return (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue.id)}
                    className={`w-full text-left p-2 sm:p-2.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                      selectedVenue === venue.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/50 border-2 border-blue-400'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border-2 border-transparent hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5 sm:gap-2 truncate">
                        {selectedVenue === venue.id && <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>}
                        <span className="truncate">{venue.name}</span>
                      </span>
                      {venueActivityCount > 0 && (
                        <span className="text-[10px] sm:text-xs bg-yellow-500 text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold flex-shrink-0 ml-2">
                          {venueActivityCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-xs opacity-75 mt-1">
                      Capacity: {venue.capacity}
                    </div>
                  </button>
                )
              })
            ) : (
              <p className="text-slate-400 text-xs sm:text-sm text-center py-4">No venues on this floor</p>
            )}
          </div>
        </div>

        {/* Mobile Floor Menu Button (Bottom Left) - Only visible on small screens */}
        <button
          onClick={() => setFloorMenuOpen(!floorMenuOpen)}
          className="md:hidden fixed bottom-4 left-4 z-30 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl active:scale-95 transition-all border-2 border-blue-400/50"
          aria-label="Toggle floor menu"
        >
          <Layers className="w-6 h-6" />
        </button>

        {/* Mobile Venue Menu Button (Bottom Right) - Only visible on small screens */}
        <button
          onClick={() => setVenueMenuOpen(!venueMenuOpen)}
          className="md:hidden fixed bottom-4 right-4 z-30 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl active:scale-95 transition-all border-2 border-purple-400/50"
          aria-label="Toggle venue menu"
        >
          <MapPin className="w-6 h-6" />
        </button>

        {/* Mobile Floor Menu Drawer */}
        {floorMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setFloorMenuOpen(false)}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl p-6 shadow-2xl border-t-2 border-blue-500/50 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Layers className="w-6 h-6 text-blue-400" />
                  Floor Navigation
                </h3>
                <button
                  onClick={() => setFloorMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Current Floor Display */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border-2 border-blue-400/40">
                <div className="text-blue-300 text-sm mb-2">Current Floor</div>
                <div className="text-white font-bold text-4xl">{floors[currentFloor].name}</div>
                <div className="text-slate-400 text-sm mt-1">{currentFloorVenues.length} venues on this floor</div>
              </div>

              {/* Floor Controls */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => handleFloorChange('down')}
                  disabled={currentFloor <= 0}
                  className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ChevronDown className="w-6 h-6" />
                  <span>Down</span>
                </button>
                <button
                  onClick={() => handleFloorChange('up')}
                  disabled={currentFloor >= 11}
                  className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Up</span>
                  <ChevronUp className="w-6 h-6" />
                </button>
              </div>

              {/* Quick Floor Selection */}
              <div>
                <div className="text-slate-400 text-sm mb-3">Quick Jump</div>
                <div className="grid grid-cols-4 gap-2">
                  {floors.map((floor) => (
                    <button
                      key={floor.level}
                      onClick={() => {
                        setCurrentFloor(floor.level)
                        setFloorMenuOpen(false)
                      }}
                      className={`p-3 rounded-lg text-sm font-semibold transition-all ${
                        currentFloor === floor.level
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {floor.level + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Venue Menu Drawer */}
        {venueMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setVenueMenuOpen(false)}>
            <div 
              className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl p-6 shadow-2xl border-t-2 border-purple-500/50 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-purple-400" />
                  {floors[currentFloor].name}
                </h3>
                <button
                  onClick={() => setVenueMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Floor Summary */}
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border-2 border-purple-400/40">
                <div className="flex items-center justify-between">
                  <div className="text-purple-300 text-sm">Active Venues</div>
                  <div className="text-white text-3xl font-bold">{currentFloorVenues.length}</div>
                </div>
              </div>

              {/* Venue List */}
              <div>
                <div className="text-slate-400 text-sm mb-3">Venues on this floor</div>
                {currentFloorVenues.length > 0 ? (
                  <div className="space-y-2">
                    {currentFloorVenues.map((venue) => (
                      <button
                        key={venue.id}
                        onClick={() => {
                          setSelectedVenue(venue.id)
                          setVenueMenuOpen(false)
                        }}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          selectedVenue === venue.id
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">{venue.name}</div>
                            <div className="text-xs opacity-75 flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {venue.capacity}
                              </span>
                              <span>{getVenueTypeLabel(venue.color)}</span>
                            </div>
                          </div>
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: venue.color }}
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    No venues on this floor
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Stream Modal */}
      <StreamModal
        isOpen={!!selectedStream}
        onClose={() => setSelectedStream(null)}
        stream={selectedStream}
      />
    </div>
  )
}
