'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Users, ExternalLink, Play, Youtube, Maximize2 } from 'lucide-react'
import Image from 'next/image'
import { LiveStream } from '@/lib/types'

interface StreamModalProps {
  isOpen: boolean
  onClose: () => void
  stream: LiveStream | null
}

type PlayerMode = 'native' | 'embed' | null

export default function StreamModal({ isOpen, onClose, stream }: StreamModalProps) {
  const [playerMode, setPlayerMode] = useState<PlayerMode>(null)

  if (!stream) return null

  const handlePlayNative = () => {
    setPlayerMode('native')
  }

  const handlePlayEmbed = () => {
    setPlayerMode('embed')
  }

  const handleOpenYouTube = () => {
    if (stream.youtubeUrl) {
      window.open(stream.youtubeUrl, '_blank')
    }
  }

  const handleClose = () => {
    setPlayerMode(null)
    onClose()
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
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-green-500/30">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-slate-700">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {stream.status === 'live' && (
                      <span className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                      </span>
                    )}
                    {stream.status === 'upcoming' && (
                      <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        UPCOMING
                      </span>
                    )}
                    {stream.status === 'ended' && (
                      <span className="bg-slate-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ENDED
                      </span>
                    )}
                    <span className="text-green-400 text-sm font-semibold">{stream.quality}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{stream.title}</h2>
                  <p className="text-slate-400 text-sm">{stream.speaker}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Player Area */}
              <div className="relative bg-black aspect-video">
                {!playerMode && (
                  // Player Selection Screen
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                    <Image
                      src={stream.thumbnail}
                      alt={stream.title}
                      fill
                      className="object-cover opacity-30"
                    />
                    <div className="relative z-10 text-center">
                      <h3 className="text-white text-2xl font-bold mb-2">Choose how to watch</h3>
                      <p className="text-slate-300 mb-8">Select your preferred viewing method</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* Play Native (Embedded in Modal) */}
                        <button
                          onClick={handlePlayNative}
                          className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-green-500/50"
                        >
                          <Play className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-bold">Play Here</div>
                            <div className="text-xs opacity-90">Watch in this window</div>
                          </div>
                        </button>

                        {/* Play in New Tab (Embedded) */}
                        <button
                          onClick={handlePlayEmbed}
                          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
                        >
                          <Maximize2 className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-bold">Fullscreen</div>
                            <div className="text-xs opacity-90">Open in new tab</div>
                          </div>
                        </button>

                        {/* Open YouTube */}
                        {stream.youtubeUrl && (
                          <button
                            onClick={handleOpenYouTube}
                            className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
                          >
                            <Youtube className="w-6 h-6" />
                            <div className="text-left">
                              <div className="font-bold">YouTube</div>
                              <div className="text-xs opacity-90">Open on YouTube</div>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {playerMode === 'native' && stream.embedUrl && (
                  // Embedded Player in Modal
                  <iframe
                    src={stream.embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={stream.title}
                  />
                )}

                {playerMode === 'embed' && stream.embedUrl && (
                  // Open in New Tab
                  <>
                    {typeof window !== 'undefined' && window.open(stream.embedUrl, '_blank')}
                    {setPlayerMode(null)}
                  </>
                )}
              </div>

              {/* Stream Info */}
              <div className="p-6 space-y-4">
                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="font-semibold text-white">{stream.viewers.toLocaleString()}</span>
                    <span>watching</span>
                  </div>
                  {stream.startTime && (
                    <div className="text-slate-400">
                      Started at {stream.startTime}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-white font-semibold mb-2">About this stream</h3>
                  <p className="text-slate-300 leading-relaxed">{stream.description}</p>
                </div>

                {/* Venue Info */}
                {stream.venue && (
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h4 className="text-green-400 font-semibold mb-1 text-sm">Broadcasting from</h4>
                    <p className="text-white">{stream.venue}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {playerMode && (
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => setPlayerMode(null)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Change Player
                    </button>
                    {stream.youtubeUrl && (
                      <button
                        onClick={handleOpenYouTube}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in YouTube
                      </button>
                    )}
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
