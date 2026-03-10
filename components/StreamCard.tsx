'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, Users, Radio } from 'lucide-react'
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
  const [imgError, setImgError] = React.useState(false)

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
          {!imgError && thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <Radio className="w-12 h-12 text-slate-700" />
            </div>
          )}

          {/* Live Badge */}
          {isLive && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}

          {/* Quality Badge */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
            {quality}
          </div>

          {/* Play Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm p-4 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <Play className="w-8 h-8 text-slate-900 fill-slate-900" />
            </motion.div>
          </div>

          {/* Viewers Badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
            <Users className="w-3 h-3" />
            {viewers?.toLocaleString() || 0}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-slate-800">
          <h3 className="font-bold text-white text-base mb-1 line-clamp-1 group-hover:text-green-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}
