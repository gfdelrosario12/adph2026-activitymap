'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, Clock, Radio } from 'lucide-react'
import { LiveStream } from '@/lib/types'

interface StreamModalProps {
  isOpen: boolean
  onClose: () => void
  stream: LiveStream | null
}

export default function StreamModal({ isOpen, onClose, stream }: StreamModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!stream) return null

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-4"
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-2 border-green-500/30">
              {/* Stream Video/Thumbnail Display */}
              <div className="relative aspect-video bg-black">
                {stream.embedUrl ? (
                  <iframe
                    src={`${stream.embedUrl}?autoplay=1&mute=0`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title={stream.title}
                  />
                ) : stream.thumbnail ? (
                  <>
                    <Image
                      src={stream.thumbnail}
                      alt={stream.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="text-center">
                        <Radio className="w-16 h-16 text-white mx-auto mb-4 opacity-50" />
                        <p className="text-white text-lg font-semibold">Stream Preview</p>
                        <p className="text-slate-300 text-sm mt-2">Video will be available soon</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <Radio className="w-20 h-20 text-slate-800" />
                  </div>
                )}
                
                {/* Live Indicator Overlay */}
                {stream.status === 'live' && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full z-10">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-white font-bold text-sm">LIVE</span>
                  </div>
                )}
                
                {/* Quality Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg z-10">
                  <span className="text-white text-sm font-semibold">{stream.quality || '720p'}</span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-2 xs:top-3 sm:top-4 right-2 xs:right-3 sm:right-4 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-1.5 xs:p-2 rounded-md sm:rounded-lg transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 xs:w-5 xs:h-5" />
                </button>
              </div>

              {/* Stream Details */}
              <div className="p-3 xs:p-4 sm:p-6 max-h-[40vh] overflow-y-auto">
                {/* Title and Status */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-white flex-1 line-clamp-2">{stream.title}</h2>
                    {stream.status === 'upcoming' && (
                      <span className="bg-yellow-500 text-black px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold whitespace-nowrap">
                        UPCOMING
                      </span>
                    )}
                    {stream.status === 'ended' && (
                      <span className="bg-slate-600 text-white px-2 xs:px-3 py-0.5 xs:py-1 rounded-full text-[10px] xs:text-xs font-bold whitespace-nowrap">
                        ENDED
                      </span>
                    )}
                  </div>
                  <p className="text-green-400 font-semibold text-sm xs:text-base">{stream.speaker}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 xs:gap-4 sm:gap-6 mb-3 sm:mb-4 text-xs xs:text-sm">
                  <div className="flex items-center gap-1.5 xs:gap-2 text-slate-300">
                    <Eye className="w-3 h-3 xs:w-4 xs:h-4 text-green-400" />
                    <span className="font-semibold text-white">{stream.viewers?.toLocaleString() || 0}</span>
                    <span className="hidden xs:inline">viewers</span>
                  </div>
                  {stream.startTime && (
                    <div className="flex items-center gap-1.5 xs:gap-2 text-slate-300">
                      <Clock className="w-3 h-3 xs:w-4 xs:h-4 text-green-400" />
                      <span>{stream.startTime}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-slate-800/50 rounded-lg p-3 xs:p-4 border border-slate-700 mb-3 sm:mb-4">
                  <h3 className="text-white font-semibold mb-2 text-sm xs:text-base">About this stream</h3>
                  <p className="text-slate-300 leading-relaxed text-xs xs:text-sm">{stream.description}</p>
                </div>

                {/* Venue Info */}
                {stream.venue && (
                  <div className="bg-green-600/20 rounded-lg p-3 xs:p-4 border border-green-500/40">
                    <h4 className="text-green-400 font-semibold mb-1 text-xs xs:text-sm">Broadcasting from</h4>
                    <p className="text-white text-sm xs:text-base">{stream.venue}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
