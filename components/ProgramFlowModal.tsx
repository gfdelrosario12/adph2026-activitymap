'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, User, Calendar, Radio } from 'lucide-react'
import { Activity } from '@/lib/types'

interface ProgramFlowModalProps {
  isOpen: boolean
  onClose: () => void
  venueName: string
  venueId: string
  activities: Activity[]
}

export default function ProgramFlowModal({ 
  isOpen, 
  onClose, 
  venueName, 
  venueId,
  activities 
}: ProgramFlowModalProps) {
  // Filter activities for this venue and sort by start time
  const venueActivities = activities
    .filter(activity => activity.venue === venueId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  // Check if venue has livestream
  const workshopVenues = ['library-workshop', 'physics-workshop', 'cafeteria-holding']
  const hasLivestream = venueId === 'main-auditorium' || 
                       venueId === 'mph1' || 
                       workshopVenues.includes(venueId)

  // Format time from 24h to 12h
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Talk': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Workshop': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Competition': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Pitch': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Exhibition': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Booth': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    }
    return colors[category] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border-2 border-green-500/30">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">{venueName}</h2>
                </div>
                
                <p className="text-green-100 text-sm">
                  {venueActivities.length} activities scheduled throughout the day
                </p>

                {hasLivestream && (
                  <div className="mt-3 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-red-500/40">
                    <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                    <span className="text-red-300 text-sm font-semibold">Live Streaming Available</span>
                  </div>
                )}
              </div>

              {/* Program Flow Timeline */}
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {venueActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No activities scheduled for this venue</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {venueActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                      >
                        {/* Timeline connector */}
                        {index < venueActivities.length - 1 && (
                          <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-green-500/50 to-transparent" />
                        )}

                        <div className="flex gap-4">
                          {/* Time indicator */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 z-10 relative">
                              <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-center mt-2">
                              <div className="text-xs text-green-400 font-bold">
                                {formatTime(activity.startTime)}
                              </div>
                              <div className="text-xs text-slate-500">to</div>
                              <div className="text-xs text-green-400 font-bold">
                                {formatTime(activity.endTime)}
                              </div>
                            </div>
                          </div>

                          {/* Activity card */}
                          <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="text-white font-semibold text-lg leading-tight flex-1">
                                {activity.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-md text-xs font-bold border whitespace-nowrap ${getCategoryColor(activity.category)}`}>
                                {activity.category}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <User className="w-4 h-4 text-green-400" />
                              <span className="text-green-300 text-sm font-medium">
                                {activity.speaker}
                              </span>
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mb-3">
                              {activity.description}
                            </p>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-4">
                                <span className="text-slate-500">
                                  Capacity: <span className="text-white font-semibold">{activity.capacity}</span>
                                </span>
                                <span className={`font-semibold ${activity.registered >= activity.capacity ? 'text-red-400' : 'text-green-400'}`}>
                                  {activity.registered}/{activity.capacity} registered
                                </span>
                              </div>
                              {activity.registered >= activity.capacity && (
                                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-md font-bold">
                                  FULL
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-800/80 p-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    Total Duration: <span className="text-white font-semibold">
                      {venueActivities.length > 0 ? 
                        `${formatTime(venueActivities[0].startTime)} - ${formatTime(venueActivities[venueActivities.length - 1].endTime)}` 
                        : 'N/A'}
                    </span>
                  </span>
                  <button
                    onClick={onClose}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
