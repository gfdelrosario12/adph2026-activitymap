'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import StreamCard from '@/components/StreamCard'
import StreamModal from '@/components/StreamModal'
import { motion } from 'framer-motion'
import { ChevronLeft, Search, Radio, Menu, X, Eye, Map } from 'lucide-react'
import { LiveStream } from '@/lib/types'

// Custom hook to load livestreams - Hardcoded streams
function useLiveStreams() {
  const [streams] = React.useState<LiveStream[]>([
    {
      id: "stream-main-hall",
      title: "Main Hall",
      description: "Main Auditorium - Live Coverage from the Main Hall",
      speaker: "Arduino Day Philippines 2026",
      venue: "Main Auditorium (12/F)",
      embedUrl: "https://www.youtube.com/embed/4Id90OJHMg4",
      thumbnail: "/cover.png",
      status: "live",
      quality: "1080p",
      viewers: 450,
      startTime: "09:00"
    },
    {
      id: "stream-secondary-hall",
      title: "Secondary Hall",
      description: "Secondary Hall - Live Workshop & Sessions",
      speaker: "Arduino Day Philippines 2026",
      venue: "MPH 1 (1/F)",
      embedUrl: "https://www.youtube.com/embed/KfO3q4yogXA",
      thumbnail: "/cover.png",
      status: "live",
      quality: "720p",
      viewers: 280,
      startTime: "10:00"
    },
    {
      id: "stream-workshop-1",
      title: "Workshop 1",
      description: "Workshop 1 - Hands-on Training & Projects",
      speaker: "Arduino Day Philippines 2026",
      venue: "Library (7/F)",
      embedUrl: "https://www.youtube.com/embed/sgPU-ohXmkM",
      thumbnail: "/cover.png",
      status: "live",
      quality: "720p",
      viewers: 120,
      startTime: "11:00"
    },
    {
      id: "stream-workshop-2",
      title: "Workshop 2",
      description: "Workshop 2 - Advanced Techniques & Skills",
      speaker: "Arduino Day Philippines 2026",
      venue: "Computer Lab (6/F)",
      embedUrl: "https://www.youtube.com/embed/F_o3yvrz9-s",
      thumbnail: "/cover.png",
      status: "live",
      quality: "720p",
      viewers: 95,
      startTime: "12:00"
    }
  ])

  return { streams, loading: false }
}

function LivestreamsContent() {
  const { streams, loading } = useLiveStreams()
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Memoize filtered streams to avoid recalculation
  const filteredStreams = React.useMemo(() => 
    streams.filter(
      (stream) =>
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [streams, searchQuery]
  )

  // Memoize categorized streams
  const { liveStreams, upcomingStreams, endedStreams } = React.useMemo(() => ({
    liveStreams: filteredStreams.filter((s) => s.status === 'live'),
    upcomingStreams: filteredStreams.filter((s) => s.status === 'upcoming'),
    endedStreams: filteredStreams.filter((s) => s.status === 'ended'),
  }), [filteredStreams])

  // Memoize animation variants
  const containerVariants = React.useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }), [])

  const itemVariants = React.useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }), [])

  // Optimize handlers with useCallback
  const handleStreamSelect = React.useCallback((stream: LiveStream) => {
    setSelectedStream(stream)
  }, [])

  const handleCloseModal = React.useCallback(() => {
    setSelectedStream(null)
  }, [])

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-red-500/30 bg-slate-800 bg-opacity-50 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-pulse" />
                <span className="hidden sm:inline">Live Streams</span>
                <span className="sm:hidden">Streams</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                {streams.length} LIVE • Arduino Day 2026
              </p>
            </div>
          </div>

          {/* Activity Map Button (Desktop) */}
          <Link
            href="/activity-map"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-semibold hover:scale-105 active:scale-95"
          >
            <Map className="w-5 h-5" />
            <span>Activity Map</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-700 bg-slate-800">
            <div className="p-4 flex flex-col gap-3">
              <Link
                href="/activity-map"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-all active:scale-95 w-full"
              >
                <Map className="w-5 h-5" />
                <span className="text-sm font-medium">Activity Map</span>
              </Link>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search streams..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-red-400 text-lg font-semibold">Loading streams...</p>
          </div>
        ) : (
          <>
            {/* Featured Live Stream Hero */}
            {liveStreams.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 sm:mb-10 md:mb-12 lg:mb-16"
              >
                <div
                  className="relative h-[200px] xs:h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => handleStreamSelect(liveStreams[0])}
                >
                  {/* Background Image/Thumbnail */}
                  <div className="absolute inset-0 bg-black">
                    {liveStreams[0].thumbnail ? (
                      <>
                        <Image
                          src={liveStreams[0].thumbnail}
                          alt={liveStreams[0].title}
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Radio className="w-24 h-24 text-slate-800" />
                      </div>
                    )}
                  </div>

                  {/* Content Overlay */}
                  <div className="relative h-full flex flex-col justify-end p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10">
                    {/* Live Badge */}
                    <div className="absolute top-3 xs:top-4 sm:top-6 left-3 xs:left-4 sm:left-6 flex items-center gap-1.5 sm:gap-2 bg-red-600 px-2.5 xs:px-3 sm:px-4 py-1 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white font-bold">LIVE NOW</span>
                    </div>

                    {/* Quality Badge */}
                    <div className="absolute top-3 xs:top-4 sm:top-6 right-3 xs:right-4 sm:right-6 bg-black/60 backdrop-blur-sm px-2 xs:px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                      <span className="text-white text-[10px] xs:text-xs sm:text-sm font-semibold">{liveStreams[0].quality || '720p'}</span>
                    </div>

                    {/* Title and Info */}
                    <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 line-clamp-2">
                      {liveStreams[0].title}
                    </h2>
                    <p className="text-slate-200 text-xs xs:text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4 line-clamp-2 max-w-3xl">
                      {liveStreams[0].description}
                    </p>

                    <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 text-slate-300 text-xs xs:text-sm sm:text-base">
                      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                        <Eye className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                        <span className="font-semibold">{liveStreams[0].viewers?.toLocaleString() || 0}</span>
                      </div>
                      <div className="truncate">
                        {liveStreams[0].speaker}
                      </div>
                    </div>

                    {/* Watch Now Button */}
                    <button 
                      onClick={() => handleStreamSelect(liveStreams[0])}
                      className="mt-3 xs:mt-4 sm:mt-6 bg-red-600 hover:bg-red-700 text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-md sm:rounded-lg text-xs xs:text-sm sm:text-base font-bold transition-all transform hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 w-fit"
                    >
                      <Radio className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                      <span>Watch Now</span>
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Live Streams Section */}
            {liveStreams.length > 0 && (
              <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mb-12 sm:mb-16"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center gap-2"
                >
                  <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                  On Air Now
                </motion.h2>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                  {liveStreams.map((stream) => (
                    <motion.div key={stream.id} variants={itemVariants}>
                      <StreamCard
                        id={stream.id}
                        title={stream.title}
                        thumbnail={stream.thumbnail || ''}
                        viewers={stream.viewers}
                        quality={stream.quality || '720p'}
                        isLive={stream.status === 'live'}
                        description={stream.description}
                        onClick={() => handleStreamSelect(stream)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {filteredStreams.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Radio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">
                  {searchQuery ? 'No streams found matching your search.' : 'No streams available.'}
                </p>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Stream Modal */}
      <StreamModal
        isOpen={!!selectedStream}
        onClose={handleCloseModal}
        stream={selectedStream}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t border-red-500/30 bg-slate-900 bg-opacity-50 backdrop-blur-md py-6 sm:py-8 px-4 sm:px-6 text-center text-slate-400 mt-16 sm:mt-24"
      >
        <p className="text-sm sm:text-base">Arduino Day Philippines 2026 • Experience Innovation Live</p>
      </motion.footer>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-400 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <LivestreamsContent />
    </Suspense>
  )
}
