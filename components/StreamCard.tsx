'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Volume2 } from 'lucide-react'
import Image from 'next/image'

interface StreamCardProps {
  id: string
  title: string
  thumbnail: string
  viewers: number
  quality: string
  isLive: boolean
  description: string
  onClick: () => void
}

export default function StreamCard({
  title,
  thumbnail,
  viewers,
  quality,
  isLive,
  description,
  onClick,
}: StreamCardProps) {
  const [imageError, setImageError] = React.useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg bg-slate-800 shadow-lg hover:shadow-xl transition-shadow">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-black">
          {thumbnail && !imageError ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-16 h-16 text-slate-800" />
            </div>
          )}

          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}

          {/* Quality Badge */}
          <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-semibold z-10">
            {quality}
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
            <motion.div
              initial={{ scale: 1, opacity: 0.9 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="bg-white/90 group-hover:bg-white p-4 rounded-full transition-all shadow-lg"
            >
              <Play className="w-6 h-6 text-slate-900 fill-slate-900" />
            </motion.div>
          </div>

          {/* Viewers Badge */}
          <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-10">
            <Users className="w-3 h-3" />
            {viewers?.toLocaleString() || 0}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-slate-800">
          <h3 className="font-semibold text-white truncate group-hover:text-green-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{description}</p>

          {/* Stream Status */}
          {isLive && (
            <div className="flex items-center gap-2 mt-3 text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-semibold">Live Now</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
