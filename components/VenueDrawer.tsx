'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, Clock } from 'lucide-react'
import { Activity, Venue } from '@/lib/types'

interface VenueDrawerProps {
  venue: Venue | null
  activities: Activity[]
  isOpen: boolean
  onClose: () => void
}

export default function VenueDrawer({
  venue,
  activities,
  isOpen,
  onClose,
}: VenueDrawerProps) {
  if (!venue) return null

  const venueActivities = activities.filter((a) => a.id.includes(venue.id.split('-')[1]))

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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{venue.name}</h2>
                <p className="text-slate-400 text-sm mt-1">{venue.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Venue Info */}
            <div className="p-6 space-y-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: venue.color }}
                />
                <span className="text-slate-300">Venue ID: {venue.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">Capacity: {venue.capacity} people</span>
              </div>
            </div>

            {/* Activities */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Scheduled Activities</h3>
              <div className="space-y-3">
                {venueActivities.length > 0 ? (
                  venueActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-500 transition-colors"
                    >
                      <h4 className="font-semibold text-white">{activity.title}</h4>
                      <p className="text-slate-400 text-sm mt-1">{activity.speaker}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <Clock className="w-4 h-4" />
                        {activity.startTime} - {activity.endTime}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded capitalize">
                          {activity.category}
                        </span>
                        <span className="text-slate-400">
                          {activity.registered}/{activity.capacity} registered
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No activities scheduled for this venue.</p>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 border-t border-slate-700 sticky bottom-0 bg-slate-900">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                View Activities
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
