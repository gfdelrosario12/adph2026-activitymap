'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import StreamCard from '@/components/StreamCard'
import StreamModalNew from '@/components/StreamModalNew'
import { motion } from 'framer-motion'
import { ChevronLeft, Search, Radio } from 'lucide-react'
import { LiveStream } from '@/lib/types'

// Custom hook to load livestreams
function useLiveStreams() {
  const [streams, setStreams] = React.useState<LiveStream[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await fetch('/data/livestreams-new.json')
        const data = await res.json()
        setStreams(data)
        setLoading(false)
      } catch (error) {
        console.error('Error loading streams:', error)
        setLoading(false)
      }
    }

    fetchStreams()
  }, [])

  return { streams, loading }
}

function LivestreamsContent() {
  const { streams, loading } = useLiveStreams()
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStreams = streams.filter(
    (stream) =>
      stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.speaker.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const liveStreams = filteredStreams.filter((s) => s.status === 'live')
  const upcomingStreams = filteredStreams.filter((s) => s.status === 'upcoming')
  const endedStreams = filteredStreams.filter((s) => s.status === 'ended')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-green-500/30 bg-slate-800 bg-opacity-50 backdrop-blur-md sticky top-0 z-40"
      >
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Go back home"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <span className="hidden xs:inline">Live Streams</span>
                <span className="xs:hidden">Streams</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                {liveStreams.length} live • {upcomingStreams.length} upcoming
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-green-400 text-lg font-semibold">Loading streams...</p>
          </div>
        ) : (
          <>
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {liveStreams.map((stream) => (
                    <motion.div key={stream.id} variants={itemVariants}>
                      <StreamCard
                        id={stream.id}
                        title={stream.title}
                        thumbnail={stream.thumbnail}
                        viewers={stream.viewers}
                        quality={stream.quality || '720p'}
                        isLive={stream.status === 'live'}
                        description={stream.description}
                        onClick={() => setSelectedStream(stream)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Upcoming Streams Section */}
            {upcomingStreams.length > 0 && (
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
                  <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                  Coming Up
                </motion.h2>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {upcomingStreams.map((stream) => (
                    <motion.div key={stream.id} variants={itemVariants}>
                      <StreamCard
                        id={stream.id}
                        title={stream.title}
                        thumbnail={stream.thumbnail}
                        viewers={stream.viewers}
                        quality={stream.quality || '720p'}
                        isLive={false}
                        description={stream.description}
                        onClick={() => setSelectedStream(stream)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {/* Past Streams Section */}
            {endedStreams.length > 0 && (
              <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8"
                >
                  Recordings
                </motion.h2>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                >
                  {endedStreams.map((stream) => (
                    <motion.div key={stream.id} variants={itemVariants}>
                      <StreamCard
                        id={stream.id}
                        title={stream.title}
                        thumbnail={stream.thumbnail}
                        viewers={stream.viewers}
                        quality={stream.quality || '720p'}
                        isLive={false}
                        description={stream.description}
                        onClick={() => setSelectedStream(stream)}
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
      <StreamModalNew
        isOpen={!!selectedStream}
        onClose={() => setSelectedStream(null)}
        stream={selectedStream}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="border-t border-green-500/30 bg-slate-900 bg-opacity-50 backdrop-blur-md py-6 sm:py-8 px-4 sm:px-6 text-center text-slate-400 mt-16 sm:mt-24"
      >
        <p className="text-sm sm:text-base">Arduino Day Philippines 2026 • Experience Innovation Live</p>
      </motion.footer>
    </div>
  )
}

export default function LivestreamsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <LivestreamsContent />
    </Suspense>
  )
}
