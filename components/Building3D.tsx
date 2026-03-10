'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Venue } from '@/lib/types'

interface Building3DProps {
  venues: Venue[]
  selectedVenue: string | null
  onVenueClick: (venueId: string) => void
  currentFloor: number
  viewMode?: 'perspective' | 'top'
  hoveredVenue?: string | null
  onVenueHover?: (venueId: string | null) => void
  isMobile?: boolean
}

function VenueBox({
  venue,
  isSelected,
  isOnCurrentFloor,
  onClick,
  onHover,
  isHovered,
  isMobile = false,
}: {
  venue: Venue
  isSelected: boolean
  isOnCurrentFloor: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
  isHovered: boolean
  isMobile?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [localHovered, setLocalHovered] = useState(false)

  const handlePointerOver = () => {
    if (!isMobile) {  // Disable hover on mobile for better performance
      setLocalHovered(true)
      onHover(true)
    }
  }

  const handlePointerOut = () => {
    if (!isMobile) {
      setLocalHovered(false)
      onHover(false)
    }
  }

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.15, 1.15, 1.15), 0.1)
      } else if (localHovered || isHovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.12, 1.12, 1.12), 0.15)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const opacity = isOnCurrentFloor ? 0.98 : 0.12
  const renderOrder = isOnCurrentFloor ? 10 : 1

  // Enhanced hover highlighting
  const isHighlighted = !isMobile && (localHovered || isHovered)

  // Make venues more square-shaped for better visibility
  const avgSize = (venue.size.width + venue.size.depth) / 2
  const squareSize = {
    width: avgSize,
    height: venue.size.height,
    depth: avgSize
  }

  return (
    <group>
      {/* Main venue box - proper rectangular room shape */}
      <mesh
        ref={meshRef}
        position={[venue.position.x, venue.position.y + squareSize.height / 2, venue.position.z]}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
        renderOrder={renderOrder}
      >
        <boxGeometry args={[squareSize.width, squareSize.height, squareSize.depth]} />
        <meshStandardMaterial
          color={isSelected ? '#FBBF24' : isHighlighted ? '#60A5FA' : venue.color}
          metalness={0.4}
          roughness={0.3}
          emissive={isSelected ? '#F59E0B' : isHighlighted ? '#3B82F6' : isOnCurrentFloor ? venue.color : '#000000'}
          emissiveIntensity={isSelected ? 2.5 : isHighlighted ? 2.0 : isOnCurrentFloor ? 0.8 : 0}
          toneMapped={false}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Floor plan base - solid colored rectangle showing room footprint */}
      {isOnCurrentFloor && (
        <mesh 
          position={[venue.position.x, venue.position.y + 0.05, venue.position.z]} 
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[squareSize.width, squareSize.depth]} />
          <meshStandardMaterial 
            color={isSelected ? '#FCD34D' : isHighlighted ? '#60A5FA' : venue.color}
            metalness={0.6}
            roughness={0.4}
            emissive={isSelected ? '#F59E0B' : isHighlighted ? '#3B82F6' : venue.color}
            emissiveIntensity={isSelected ? 1.0 : isHighlighted ? 0.8 : 0.5}
            toneMapped={false}
            transparent
            opacity={isSelected ? 0.95 : isHighlighted ? 0.95 : 0.9}
          />
        </mesh>
      )}

      {/* Room boundaries - thick border lines showing exact room shape */}
      {isOnCurrentFloor && (
        <>
          {/* Bottom border (rectangle outline) */}
          {[
            // Front edge
            { start: [-squareSize.width/2, 0, -squareSize.depth/2], end: [squareSize.width/2, 0, -squareSize.depth/2] },
            // Right edge
            { start: [squareSize.width/2, 0, -squareSize.depth/2], end: [squareSize.width/2, 0, squareSize.depth/2] },
            // Back edge
            { start: [squareSize.width/2, 0, squareSize.depth/2], end: [-squareSize.width/2, 0, squareSize.depth/2] },
            // Left edge
            { start: [-squareSize.width/2, 0, squareSize.depth/2], end: [-squareSize.width/2, 0, -squareSize.depth/2] },
          ].map((edge, idx) => (
            <mesh 
              key={`boundary-${idx}`}
              position={[
                venue.position.x + (edge.start[0] + edge.end[0]) / 2,
                venue.position.y + 0.1,
                venue.position.z + (edge.start[2] + edge.end[2]) / 2
              ]}
              rotation={idx % 2 === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]}
            >
              <boxGeometry args={[
                idx % 2 === 0 ? squareSize.width : squareSize.depth,
                0.3,
                0.15
              ]} />
              <meshStandardMaterial 
                color={isSelected ? '#FFFFFF' : isHighlighted ? '#60A5FA' : '#1e293b'}
                metalness={0.8}
                roughness={0.2}
                emissive={isSelected ? '#FBBF24' : isHighlighted ? '#3B82F6' : '#000000'}
                emissiveIntensity={isSelected ? 1.5 : isHighlighted ? 1.2 : 0}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Interior details and room divisions - floor plan style */}
      {isOnCurrentFloor && !isMobile && (
        <group position={[venue.position.x, venue.position.y + 0.15, venue.position.z]}>
          {/* Room grid lines - showing seating/desk arrangement */}
          {Array.from({ length: Math.min(5, Math.floor(squareSize.width / 5)) }).map((_, i) => (
            <React.Fragment key={`grid-${i}`}>
              {/* Vertical divider lines */}
              <mesh position={[-squareSize.width/2 + (i + 1) * (squareSize.width / (Math.floor(squareSize.width / 5) + 1)), 0, 0]}>
                <boxGeometry args={[0.05, 0.02, squareSize.depth * 0.9]} />
                <meshStandardMaterial 
                  color="#64748b" 
                  transparent 
                  opacity={0.3}
                />
              </mesh>
              {/* Horizontal divider lines */}
              <mesh position={[0, 0, -squareSize.depth/2 + (i + 1) * (squareSize.depth / (Math.floor(squareSize.depth / 5) + 1))]}>
                <boxGeometry args={[squareSize.width * 0.9, 0.02, 0.05]} />
                <meshStandardMaterial 
                  color="#64748b" 
                  transparent 
                  opacity={0.3}
                />
              </mesh>
            </React.Fragment>
          ))}

          {/* Furniture/Desk placements when selected - proper rectangular shapes */}
          {(isSelected || isHighlighted) && (
            <>
              {Array.from({ length: Math.min(5, Math.floor(squareSize.width / 4)) }).map((_, i) => (
                <React.Fragment key={`furniture-${i}`}>
                  {/* Rectangular desks/tables */}
                  <mesh position={[-squareSize.width/3 + i * (squareSize.width/2.5), 0.15, squareSize.depth/4]}>
                    <boxGeometry args={[Math.min(3, squareSize.width/6), 0.1, Math.min(2, squareSize.depth/8)]} />
                    <meshStandardMaterial 
                      color="#8B4513" 
                      metalness={0.2} 
                      roughness={0.8}
                      emissive={isHighlighted ? '#60A5FA' : '#000000'}
                      emissiveIntensity={isHighlighted ? 0.3 : 0}
                    />
                  </mesh>
                  {/* Chairs - small squares */}
                  <mesh position={[-squareSize.width/3 + i * (squareSize.width/2.5), 0.2, squareSize.depth/4 + 1.2]}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial 
                      color="#2c3e50" 
                      metalness={0.3} 
                      roughness={0.7}
                      emissive={isHighlighted ? '#60A5FA' : '#000000'}
                      emissiveIntensity={isHighlighted ? 0.3 : 0}
                    />
                  </mesh>
                </React.Fragment>
              ))}
              
              {/* Podium/Stage area - rectangular platform */}
              <mesh position={[0, 0.1, -squareSize.depth/3]}>
                <boxGeometry args={[Math.min(4, squareSize.width/5), 0.2, Math.min(3, squareSize.depth/7)]} />
                <meshStandardMaterial 
                  color="#34495e" 
                  metalness={0.4} 
                  roughness={0.6}
                  emissive={isHighlighted ? '#60A5FA' : '#000000'}
                  emissiveIntensity={isHighlighted ? 0.3 : 0}
                />
              </mesh>
            </>
          )}
          
          {/* Internal room partitions for larger venues */}
          {squareSize.width > 15 && (isSelected || isHighlighted) && (
            <>
              {/* Main partition wall - vertical */}
              <mesh position={[squareSize.width/4, 0.8, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.1, 1.5, squareSize.depth * 0.7]} />
                <meshStandardMaterial 
                  color="#95a5a6" 
                  transparent 
                  opacity={isSelected ? 0.5 : 0.3} 
                  metalness={0.5} 
                  roughness={0.5} 
                />
              </mesh>
              <mesh position={[-squareSize.width/4, 0.8, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.1, 1.5, squareSize.depth * 0.7]} />
                <meshStandardMaterial 
                  color="#95a5a6" 
                  transparent 
                  opacity={isSelected ? 0.5 : 0.3} 
                  metalness={0.5} 
                  roughness={0.5} 
                />
              </mesh>

              {/* Doorway indicators - gaps in walls */}
              <mesh position={[0, 0.5, squareSize.depth/2 - 0.1]}>
                <boxGeometry args={[1.5, 2, 0.15]} />
                <meshStandardMaterial 
                  color="#1e293b" 
                  metalness={0.6} 
                  roughness={0.4}
                />
              </mesh>
            </>
          )}
        </group>
      )}

      {/* Glowing outline - proper rectangular border showing room shape */}
      {isOnCurrentFloor && (
        <>
          {/* Main room outline - box edges */}
          <lineSegments
            position={[venue.position.x, venue.position.y + squareSize.height / 2, venue.position.z]}
            renderOrder={renderOrder + 1}
          >
            <edgesGeometry args={[new THREE.BoxGeometry(squareSize.width, squareSize.height, squareSize.depth)]} />
            <lineBasicMaterial 
              color={isSelected ? '#FBBF24' : isHighlighted ? '#60A5FA' : venue.color} 
              linewidth={isSelected ? 4 : isHighlighted ? 3 : 2}
              transparent
              opacity={isSelected ? 1 : isHighlighted ? 1 : 0.7}
            />
          </lineSegments>

          {/* Enhanced glow effect for hovered venue */}
          {isHighlighted && !isSelected && (
            <mesh
              position={[venue.position.x, venue.position.y + squareSize.height / 2, venue.position.z]}
            >
              <boxGeometry args={[squareSize.width + 0.5, squareSize.height + 0.5, squareSize.depth + 0.5]} />
              <meshBasicMaterial 
                color="#60A5FA"
                transparent
                opacity={0.2}
                toneMapped={false}
              />
            </mesh>
          )}

          {/* Floor plan border - thick rectangle at ground level */}
          <lineSegments
            position={[venue.position.x, venue.position.y + 0.15, venue.position.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={renderOrder + 2}
          >
            <edgesGeometry args={[new THREE.PlaneGeometry(squareSize.width, squareSize.depth)]} />
            <lineBasicMaterial 
              color={isSelected ? '#FFFFFF' : isHighlighted ? '#60A5FA' : '#1e293b'} 
              linewidth={isSelected ? 6 : isHighlighted ? 5 : 3}
              transparent
              opacity={1}
            />
          </lineSegments>
        </>
      )}

      {/* Floating label - Always visible for current floor venues, bigger and clearer */}
      {isOnCurrentFloor && (
        <>
          <Html 
            position={[venue.position.x, venue.position.y + squareSize.height + 2.5, venue.position.z]} 
            center
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <div 
              className={`text-white px-5 py-3 rounded-xl font-semibold whitespace-nowrap shadow-2xl backdrop-blur-sm transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-3 border-white/50 scale-110' 
                  : isHighlighted
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-white/40 scale-105'
                  : 'bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-white/20'
              }`}
              style={{
                fontSize: isSelected ? '16px' : isHighlighted ? '15px' : '14px',
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className={`w-2.5 h-2.5 rounded-full ${isSelected || isHighlighted ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: isHighlighted ? '#60A5FA' : venue.color }}
                ></div>
                <span className="font-bold">{venue.name}</span>
              </div>
              <div className="text-xs text-white/80 mt-1 flex items-center gap-2">
                <span>Capacity: {venue.capacity}</span>
                <span>•</span>
                <span>{venue.size.width.toFixed(0)}m × {venue.size.depth.toFixed(0)}m</span>
              </div>
            </div>
          </Html>
        </>
      )}

      {/* Floor indicator beam for current floor */}
      {isOnCurrentFloor && !isSelected && !isHighlighted && (
        <mesh position={[venue.position.x, venue.position.y - 0.5, venue.position.z]}>
          <cylinderGeometry args={[0.5, 0.8, 1, 6]} />
          <meshStandardMaterial 
            color={venue.color}
            emissive={venue.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Active Floor Pedestal - Rectangular ring matching room shape */}
      {isOnCurrentFloor && (
        <>
          {/* Outer glow ring - rectangular */}
          <mesh position={[venue.position.x, venue.position.y + 0.02, venue.position.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[
              Math.max(squareSize.width, squareSize.depth) / 1.8, 
              Math.max(squareSize.width, squareSize.depth) / 1.6, 
              4  // 4 segments makes it square/rectangular
            ]} />
            <meshBasicMaterial 
              color={isHighlighted ? '#60A5FA' : venue.color} 
              transparent 
              opacity={isSelected ? 0.6 : isHighlighted ? 0.7 : 0.4}
              toneMapped={false}
            />
          </mesh>
          
          {/* Enhanced hover ring - pulsing effect */}
          {isHighlighted && !isSelected && (
            <mesh position={[venue.position.x, venue.position.y + 0.08, venue.position.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[
                Math.max(squareSize.width, squareSize.depth) / 1.5, 
                Math.max(squareSize.width, squareSize.depth) / 1.3, 
                4
              ]} />
              <meshBasicMaterial 
                color="#60A5FA" 
                transparent 
                opacity={0.8}
                toneMapped={false}
              />
            </mesh>
          )}
          
          {/* Corner markers - square room indicators */}
          {[
            [-squareSize.width/2, -squareSize.depth/2],
            [squareSize.width/2, -squareSize.depth/2],
            [-squareSize.width/2, squareSize.depth/2],
            [squareSize.width/2, squareSize.depth/2],
          ].map(([x, z], idx) => (
            <mesh 
              key={`corner-${idx}`}
              position={[venue.position.x + x, venue.position.y + 0.1, venue.position.z + z]}
            >
              <boxGeometry args={[0.3, 0.2, 0.3]} />
              <meshStandardMaterial 
                color={venue.color}
                emissive={venue.color}
                emissiveIntensity={isSelected ? 2 : isHighlighted ? 1.5 : 1}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </>
      )}

      {/* Spotlight effect for hovered venue */}
      {isHighlighted && !isSelected && (
        <pointLight
          position={[venue.position.x, venue.position.y + squareSize.height + 5, venue.position.z]}
          color="#60A5FA"
          intensity={3}
          distance={20}
          decay={2}
        />
      )}
    </group>
  )
}

function BuildingStructure({ floors = 12, currentFloor, hasSelection }: { floors?: number; currentFloor: number; hasSelection: boolean }) {
  const floorHeight = 4
  const buildingWidth = 55  // Increased from 30 to accommodate larger venues
  const buildingDepth = 55  // Increased from 30 to accommodate larger venues
  
  // When a floor is selected, make that floor's structure more transparent
  const getFloorOpacity = (floorIdx: number) => {
    if (currentFloor === floorIdx) {
      return hasSelection ? 0.01 : 0.05  // Much more transparent when viewing
    }
    return 0.08  // Other floors also more transparent
  }
  
  return (
    <group>
      {/* Main Building Shell - Artistic when zoomed out */}
      <mesh position={[0, (floors * floorHeight) / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[buildingWidth, floors * floorHeight, buildingDepth]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.2}
          roughness={0.8}
          transparent
          opacity={hasSelection ? 0.03 : 0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floor Slabs with varying transparency */}
      {Array.from({ length: floors }).map((_, i) => (
        <group key={i}>
          {/* Floor slab - more visible when not current floor */}
          <mesh position={[0, i * floorHeight, 0]} receiveShadow castShadow>
            <boxGeometry args={[buildingWidth, 0.25, buildingDepth]} />
            <meshStandardMaterial
              color="#475569"
              metalness={0.5}
              roughness={0.5}
              transparent
              opacity={getFloorOpacity(i)}
            />
          </mesh>

          {/* Highlight plane for current floor */}
          {i === currentFloor && (
            <mesh position={[0, i * floorHeight + 0.3, 0]} receiveShadow>
              <boxGeometry args={[buildingWidth + 2, 0.1, buildingDepth + 2]} />
              <meshStandardMaterial
                color="#3b82f6"
                metalness={0.7}
                roughness={0.2}
                emissive="#3b82f6"
                emissiveIntensity={0.3}
                transparent
                opacity={0.15}
              />
            </mesh>
          )}
          
          {/* Floor edge lines - always visible for structure */}
          <lineSegments position={[0, i * floorHeight, 0]}>
            <edgesGeometry 
              args={[new THREE.BoxGeometry(buildingWidth, 0.25, buildingDepth)]} 
            />
            <lineBasicMaterial color="#64748b" linewidth={2} opacity={0.6} transparent />
          </lineSegments>
          
          {/* Corner markers with glow */}
          {[
            [-buildingWidth/2, buildingDepth/2],
            [buildingWidth/2, buildingDepth/2],
            [-buildingWidth/2, -buildingDepth/2],
            [buildingWidth/2, -buildingDepth/2],
          ].map(([x, z], idx) => (
            <mesh key={idx} position={[x, i * floorHeight, z]}>
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial 
                color={i === currentFloor ? '#3b82f6' : '#64748b'} 
                metalness={0.6} 
                emissive={i === currentFloor ? '#3b82f6' : '#000000'}
                emissiveIntensity={i === currentFloor ? 0.5 : 0}
                transparent 
                opacity={0.7} 
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Corner Columns - Architectural pillars */}
      {[
        [-buildingWidth/2, 0, -buildingDepth/2],
        [buildingWidth/2, 0, -buildingDepth/2],
        [-buildingWidth/2, 0, buildingDepth/2],
        [buildingWidth/2, 0, buildingDepth/2],
      ].map((pos, i) => (
        <mesh 
          key={i} 
          position={[pos[0], (floors * floorHeight) / 2, pos[2]]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.8, floors * floorHeight, 0.8]} />
          <meshStandardMaterial 
            color="#64748b" 
            metalness={0.7} 
            roughness={0.3}
            transparent
            opacity={hasSelection ? 0.3 : 0.6}
          />
        </mesh>
      ))}

      {/* Artistic Windows - Full detail when zoomed out, fade when focused */}
      {Array.from({ length: floors }).map((_, floorIdx) => {
        const isCurrentFloor = floorIdx === currentFloor
        const windowOpacity = isCurrentFloor ? 0.08 : 0.25  // Much more transparent on current floor
        
        return (
          <group key={`windows-${floorIdx}`}>
            {/* Front windows */}
            {Array.from({ length: 12 }).map((_, windowIdx) => (
              <mesh
                key={`front-${windowIdx}`}
                position={[
                  -buildingWidth/2 + 3 + windowIdx * 4.3,
                  floorIdx * floorHeight + floorHeight/2,
                  -buildingDepth/2 - 0.05
                ]}
                castShadow
              >
                <planeGeometry args={[2.2, 2.8]} />
                <meshStandardMaterial 
                  color={isCurrentFloor ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloor ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloor ? 0.3 : 0.15}
                  transparent
                  opacity={windowOpacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            
            {/* Back windows */}
            {Array.from({ length: 12 }).map((_, windowIdx) => (
              <mesh
                key={`back-${windowIdx}`}
                position={[
                  -buildingWidth/2 + 3 + windowIdx * 4.3,
                  floorIdx * floorHeight + floorHeight/2,
                  buildingDepth/2 + 0.05
                ]}
                castShadow
              >
                <planeGeometry args={[2.2, 2.8]} />
                <meshStandardMaterial 
                  color={isCurrentFloor ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloor ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloor ? 0.3 : 0.15}
                  transparent
                  opacity={windowOpacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            
            {/* Left windows */}
            {Array.from({ length: 12 }).map((_, windowIdx) => (
              <mesh
                key={`left-${windowIdx}`}
                position={[
                  -buildingWidth/2 - 0.05,
                  floorIdx * floorHeight + floorHeight/2,
                  -buildingDepth/2 + 3 + windowIdx * 4.3
                ]}
                rotation={[0, Math.PI / 2, 0]}
                castShadow
              >
                <planeGeometry args={[2.2, 2.8]} />
                <meshStandardMaterial 
                  color={isCurrentFloor ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloor ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloor ? 0.3 : 0.15}
                  transparent
                  opacity={windowOpacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            
            {/* Right windows */}
            {Array.from({ length: 12 }).map((_, windowIdx) => (
              <mesh
                key={`right-${windowIdx}`}
                position={[
                  buildingWidth/2 + 0.05,
                  floorIdx * floorHeight + floorHeight/2,
                  -buildingDepth/2 + 3 + windowIdx * 4.3
                ]}
                rotation={[0, -Math.PI / 2, 0]}
                castShadow
              >
                <planeGeometry args={[2.2, 2.8]} />
                <meshStandardMaterial 
                  color={isCurrentFloor ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloor ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloor ? 0.3 : 0.15}
                  transparent
                  opacity={windowOpacity}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}

            {/* Window frames for detail */}
            {Array.from({ length: 7 }).map((_, windowIdx) => (
              <lineSegments
                key={`frame-${windowIdx}`}
                position={[
                  -buildingWidth/2 + 3 + windowIdx * 4,
                  floorIdx * floorHeight + floorHeight/2,
                  -buildingDepth/2 - 0.06
                ]}
              >
                <edgesGeometry args={[new THREE.PlaneGeometry(2.2, 2.8)]} />
                <lineBasicMaterial color="#1e293b" linewidth={1} />
              </lineSegments>
            ))}
          </group>
        )
      })}

      {/* Roof with architectural details */}
      <mesh position={[0, floors * floorHeight, 0]} castShadow>
        <boxGeometry args={[buildingWidth + 1, 0.4, buildingDepth + 1]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.5} 
          roughness={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Roof accent - modern overhang */}
      <mesh position={[0, floors * floorHeight + 0.3, 0]} castShadow>
        <boxGeometry args={[buildingWidth + 1.5, 0.15, buildingDepth + 1.5]} />
        <meshStandardMaterial 
          color="#334155" 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>

      {/* Entrance canopy */}
      <mesh position={[0, 2.5, -buildingDepth/2 - 1.5]} castShadow receiveShadow>
        <boxGeometry args={[14, 0.2, 3]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Entrance pillars */}
      {[-6, 6].map((xPos, idx) => (
        <mesh 
          key={idx} 
          position={[xPos, 1.2, -buildingDepth/2 - 1.5]}
          castShadow
        >
          <cylinderGeometry args={[0.3, 0.4, 2.5, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Ground plane */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#0f172a" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* Courtyard with pattern */}
      <mesh position={[0, 0.02, -buildingDepth/2 - 8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Grid for context */}
      <gridHelper args={[70, 35, '#334155', '#1e293b']} position={[0, 0.01, 0]} />
    </group>
  )
}

function Scene({
  venues,
  selectedVenue,
  onVenueClick,
  currentFloor,
  viewMode = 'perspective',
  hoveredVenue = null,
  onVenueHover,
  isMobile = false,
}: Building3DProps) {
  return (
    <>
      <OrbitControls
        maxDistance={viewMode === 'top' ? 120 : (isMobile ? 200 : 180)}
        minDistance={viewMode === 'top' ? 50 : (isMobile ? 40 : 30)}
        maxPolarAngle={viewMode === 'top' ? 0.1 : Math.PI * 0.48}
        minPolarAngle={viewMode === 'top' ? 0 : Math.PI * 0.05}
        enablePan={true}
        target={[0, currentFloor * 4 + 2, 0]}
        enableDamping
        dampingFactor={0.05}
        enableRotate={viewMode !== 'top'}  // Disable rotation in top view for pure overhead
      />
      
      {/* Lighting - Simplified for mobile */}
      <ambientLight intensity={isMobile ? 0.6 : 0.5} />
      
      {/* Main sun light */}
      <directionalLight
        position={[40, 60, 40]}
        intensity={isMobile ? 1.2 : 1.5}
        castShadow={!isMobile}
        shadow-mapSize-width={isMobile ? 2048 : 4096}
        shadow-mapSize-height={isMobile ? 2048 : 4096}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={0.5}
        shadow-camera-far={250}
        shadow-bias={-0.0001}
      />
      
      {/* Fill lights - Reduced on mobile */}
      {!isMobile && (
        <>
          <directionalLight position={[-40, 40, -40]} intensity={0.6} />
          <directionalLight position={[0, 30, -50]} intensity={0.4} />
        </>
      )}
      
      {/* Hemisphere light for natural sky/ground lighting */}
      <hemisphereLight 
        intensity={0.4} 
        color="#87CEEB" 
        groundColor="#2c3e50" 
      />
      
      {/* Spot light for dramatic effect - Desktop only */}
      {!isMobile && (
        <spotLight
          position={[0, 70, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={0.5}
          castShadow
        />
      )}
      
      {/* Building Structure */}
      <BuildingStructure 
        floors={12} 
        currentFloor={currentFloor}
        hasSelection={selectedVenue !== null}
      />
      
      {/* Venue boxes */}
      {venues.map((venue) => (
        <VenueBox
          key={venue.id}
          venue={venue}
          isSelected={selectedVenue === venue.id}
          isOnCurrentFloor={venue.floor === currentFloor}
          onClick={() => onVenueClick(venue.id)}
          onHover={(hovered) => {
            if (onVenueHover) {
              onVenueHover(hovered ? venue.id : null)
            }
          }}
          isHovered={hoveredVenue === venue.id}
          isMobile={isMobile}  // Pass mobile state to VenueBox
        />
      ))}
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0f172a', 100, 220]} />
    </>
  )
}

export default function Building3D({
  venues,
  selectedVenue,
  onVenueClick,
  currentFloor,
  viewMode = 'perspective',
  hoveredVenue,
  onVenueHover,
}: Building3DProps) {
  // Detect mobile device for performance optimization
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Dynamic camera position based on view mode and device
  // Top view: directly overhead with minimal offset for rendering
  const cameraPosition: [number, number, number] = viewMode === 'top' 
    ? [0, 100, 0.01]  // Truly top-down view (almost zero Z offset)
    : isMobile 
    ? [90, 45, 90]    // Farther away on mobile for better overview
    : [70, 35, 70]    // Perspective view desktop

  // Adjust FOV for mobile
  const fov = viewMode === 'top' ? 70 : (isMobile ? 65 : 55)

  return (
    <Canvas
      shadows={!isMobile}  // Disable shadows on mobile for performance
      dpr={isMobile ? [1, 1.5] : [1, 2]}  // Lower pixel ratio on mobile
      camera={{ 
        position: cameraPosition, 
        fov: fov,
        near: 0.1,
        far: 300,
      }}
      style={{ width: '100%', height: '100%' }}
      performance={{ min: 0.5 }}  // Adaptive performance
    >
      <Scene
        venues={venues}
        selectedVenue={selectedVenue}
        onVenueClick={onVenueClick}
        currentFloor={currentFloor}
        viewMode={viewMode}
        hoveredVenue={hoveredVenue}
        onVenueHover={onVenueHover}
        isMobile={isMobile}
      />
    </Canvas>
  )
}
