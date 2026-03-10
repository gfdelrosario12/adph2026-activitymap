'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Building, Radio, ChevronUp, ChevronDown, Clock, Users, Eye, Map } from 'lucide-react'
import Building3D from '@/components/Building3D'
import { useVenues, useActivities, useFloors } from '@/lib/hooks/useData'
import { getVenuesByFloor, getActivitiesByVenue, getVenueTypeLabel } from '@/lib/utils/helpers'
import { APP_CONFIG } from '@/lib/constants/config'

export default function Home() {
  const [currentFloor, setCurrentFloor] = useState(0)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'perspective' | 'top'>('perspective')
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null)

  // Load data from JSON files using custom hooks
  const { venues, loading: venuesLoading } = useVenues()
  const { activities, loading: activitiesLoading } = useActivities()
  const { floors, loading: floorsLoading } = useFloors()

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
      {/* Navigation - Responsive */}
      <nav className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4 backdrop-blur-md bg-slate-900 bg-opacity-90 border-b border-green-500/30 z-10">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
          <Building className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          <span className="hidden xs:inline">Arduino Day Philippines 2026</span>
          <span className="xs:hidden">ADP 2026</span>
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="hidden md:block text-slate-400 text-xs sm:text-sm">
            {currentFloorVenues.length} venues • {venues.length} total
          </div>
          <button
            onClick={() => setViewMode(viewMode === 'perspective' ? 'top' : 'perspective')}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded-lg transition-all border border-green-500/30 hover:border-green-400/50"
            title={viewMode === 'perspective' ? 'Switch to Top View' : 'Switch to Perspective View'}
          >
            {viewMode === 'perspective' ? <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {viewMode === 'perspective' ? 'Top View' : 'Perspective'}
            </span>
          </button>
          <Link
            href="/livestreams"
            className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2"
          >
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-sm">Streams</span>
          </Link>
        </div>
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
            viewMode={viewMode}
            hoveredVenue={hoveredVenue}
            onVenueHover={setHoveredVenue}
          />
        </div>

        {/* Top View Indicator Banner - Responsive */}
        {viewMode === 'top' && (
          <div className="absolute top-4 sm:top-8 md:top-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none px-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full shadow-2xl border-2 border-white/30 backdrop-blur-sm flex items-center gap-2 sm:gap-3 animate-pulse">
              <Map className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-bold text-xs sm:text-sm md:text-base">Floor Plan View Active</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        )}

        {/* Hover Tooltip - Enhanced UX - Responsive */}
        {hoveredVenueData && hoveredVenue !== selectedVenue && (
          <div 
            className="fixed sm:absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 px-4 w-full sm:w-auto max-w-[90vw] sm:max-w-md"
            style={{ 
              animation: 'fadeIn 0.2s ease-in-out',
            }}
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-3 sm:gap-4 mb-2 sm:mb-3">
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg md:text-xl flex items-center gap-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full animate-pulse" style={{ backgroundColor: hoveredVenueData?.color }}></div>
                    <span className="line-clamp-1">{hoveredVenueData?.name}</span>
                  </h3>
                  <div className="text-slate-400 text-xs sm:text-sm mt-1">
                    {hoveredVenueData && floors[hoveredVenueData.floor]?.name || `Floor ${(hoveredVenueData?.floor ?? 0) + 1}`}
                  </div>
                </div>
                <div 
                  className="px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                  style={{ 
                    backgroundColor: `${hoveredVenueData?.color}30`,
                    color: hoveredVenueData?.color,
                    border: `1px solid ${hoveredVenueData?.color}50`
                  }}
                >
                  {hoveredVenueData && getVenueTypeLabel(hoveredVenueData.color)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 border border-slate-700/50">
                  <div className="text-slate-400 text-[10px] sm:text-xs mb-1">Capacity</div>
                  <div className="text-white font-bold text-sm sm:text-base md:text-lg flex items-center gap-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                    {hoveredVenueData?.capacity}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-2 sm:p-3 border border-slate-700/50">
                  <div className="text-slate-400 text-[10px] sm:text-xs mb-1">Dimensions</div>
                  <div className="text-white font-bold text-xs sm:text-sm">
                    {hoveredVenueData?.size.width.toFixed(0)}m × {hoveredVenueData?.size.depth.toFixed(0)}m
                  </div>
                </div>
              </div>

              {hoveredVenueData && getActivitiesByVenue(activities, hoveredVenueData.id).length > 0 && (
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-2 sm:p-3 border border-blue-500/30">
                  <div className="text-blue-300 text-[10px] sm:text-xs font-semibold mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Active Sessions
                  </div>
                  <div className="text-white text-xs sm:text-sm font-medium">
                    {getActivitiesByVenue(activities, hoveredVenueData.id).length} activity(ies) scheduled
                  </div>
                </div>
              )}

              <div className="mt-2 sm:mt-3 text-center text-slate-500 text-[10px] sm:text-xs">
                Click to select and view details
              </div>
            </div>
          </div>
        )}

        {/* Floor Controls - Responsive with mobile optimization */}
        <div className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border-2 border-blue-500/30 rounded-xl p-2 sm:p-3 md:p-4 z-20 shadow-2xl">
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            {/* View Mode Indicator - Hidden on mobile */}
            <div className="hidden sm:block mb-2 pb-3 border-b border-slate-700/50 w-full">
              <div className="text-slate-400 text-xs text-center mb-2">View Mode</div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <div className={`px-2 py-1 rounded ${viewMode === 'perspective' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                  Persp.
                </div>
                <div className={`px-2 py-1 rounded ${viewMode === 'top' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                  Top
                </div>
              </div>
            </div>

            <button
              onClick={() => handleFloorChange('up')}
              disabled={currentFloor >= 11}
              className="p-2 sm:p-2.5 md:p-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-110 disabled:hover:scale-100 active:scale-95"
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
              className="p-2 sm:p-2.5 md:p-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-blue-500/50 hover:scale-110 disabled:hover:scale-100 active:scale-95"
              title="Go down one floor"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Venue Info Panel - Responsive with drawer on mobile */}
        <div className="absolute right-2 sm:right-4 md:right-6 top-2 sm:top-4 md:top-6 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-xl border-2 border-purple-500/30 rounded-xl p-3 sm:p-4 md:p-6 w-[calc(100vw-5rem)] sm:w-80 md:w-96 z-20 shadow-2xl max-h-[40vh] sm:max-h-[50vh] md:max-h-[70vh] overflow-y-auto">
          <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              {floors[currentFloor].name}
            </span>
          </h2>

          {/* Floor Summary - Highlight active venues */}
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border-2 border-blue-400/40">
            <div className="flex items-center justify-between mb-2">
              <div className="text-blue-300 text-xs sm:text-sm font-semibold">Active Venues</div>
              <div className="text-white text-xl sm:text-2xl font-bold">{currentFloorVenues.length}</div>
            </div>
            <div className="text-slate-300 text-[10px] sm:text-xs">
              All venues highlighted in 3D view
            </div>
            {viewMode === 'top' && (
              <div className="mt-2 text-blue-400 text-[10px] sm:text-xs flex items-center gap-1">
                <Map className="w-3 h-3" />
                Top-down floor plan view active
              </div>
            )}
          </div>
          
          {selectedVenueData && venueActivities.length > 0 && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg border-2 border-blue-500/40 shadow-lg">
              <h3 className="text-white font-bold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="truncate">{selectedVenueData?.name}</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {venueActivities.map(activity => (
                  <div key={activity.id} className="text-xs sm:text-sm bg-slate-800/50 p-2 sm:p-3 rounded-lg border border-slate-600/50">
                    <div className="text-blue-300 font-semibold truncate">{activity.title}</div>
                    <div className="text-slate-300 text-[10px] sm:text-xs mt-1 truncate">{activity.speaker}</div>
                    <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-[10px] sm:text-xs mt-2">
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
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <div className="text-slate-400 text-[10px] sm:text-xs mb-2 sm:mb-3 flex items-center gap-2">
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
                    className={`w-full text-left p-2.5 sm:p-3 md:p-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
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

        {/* Floor List - Responsive, hidden on mobile */}
        <div className="hidden md:block absolute right-2 md:right-6 bottom-2 md:bottom-6 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-xl border-2 border-slate-600/30 rounded-xl p-3 md:p-4 z-20 max-h-60 md:max-h-72 overflow-y-auto shadow-2xl">
          {/* Color Legend */}
          <div className="mb-3 md:mb-4 pb-2 md:pb-3 border-b border-slate-700/50">
            <div className="text-white font-bold text-[10px] md:text-xs mb-2">Venue Types</div>
            <div className="space-y-1 md:space-y-1.5">
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                <span className="text-slate-300">Labs</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#059669' }}></div>
                <span className="text-slate-300">Workshops</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
                <span className="text-slate-300">Booths and Activities</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: '#15803d' }}></div>
                <span className="text-slate-300">Facilities</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                <span className="text-slate-300">🚻 Comfort Rooms</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs">
                <span className="text-slate-300">🔒 Restricted Access</span>
              </div>
            </div>
          </div>

          <div className="text-white font-bold text-xs md:text-sm mb-2 md:mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full"></div>
            Quick Nav
          </div>
          <div className="space-y-0.5 md:space-y-1">
            {floors.map((floor, idx) => {
              const floorVenueCount = venues.filter(v => v.floor === idx).length
              return (
                <button
                  key={floor.id}
                  onClick={() => setCurrentFloor(idx)}
                  className={`w-full text-left px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-all flex items-center justify-between ${
                    currentFloor === idx
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <span className="truncate">{floor.name}</span>
                  <span className={`text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full ${
                    currentFloor === idx ? 'bg-white/20' : 'bg-slate-600'
                  }`}>
                    {floorVenueCount}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
