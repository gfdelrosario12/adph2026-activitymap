'use client'

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { Venue, Activity } from '@/lib/types'
import ProgramFlowModal from './ProgramFlowModal'

interface Building3DProps {
  venues: Venue[]
  activities: Activity[]
  currentFloor: number
  onVenueClick: (venue: Venue) => void
  externalSelectedVenue?: string | null
}

// Camera animation component - Optimized
function CameraController({ target, enabled }: { target: [number, number, number], enabled: boolean }) {
  const { camera, controls } = useThree()
  const targetRef = useRef(new THREE.Vector3())
  const lookAtRef = useRef(new THREE.Vector3())
  
  useEffect(() => {
    targetRef.current.set(...target)
    lookAtRef.current.set(target[0] - 15, target[1] - 10, target[2] - 15)
  }, [target])
  
  useFrame(() => {
    if (!enabled || !controls) return
    
    const currentDist = camera.position.distanceTo(targetRef.current)
    
    // Stop animating when close enough (optimization)
    if (currentDist < 0.1) return
    
    // Smooth lerp with easing
    camera.position.lerp(targetRef.current, 0.08)
    // @ts-ignore - OrbitControls has target property
    controls.target.lerp(lookAtRef.current, 0.08)
    // @ts-ignore
    controls.update()
  })
  
  return null
}

function VenueBoxComponent({
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
  const [localHovered, setLocalHovered] = React.useState(false)

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
        position={[venue.position.x, venue.position.y, venue.position.z]}
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
          position={[venue.position.x, venue.position.y - squareSize.height / 2 + 0.02, venue.position.z]}
          rotation={[-Math.PI / 2, 0, 0]}
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

      {/* Balconies on specific floors (every 3rd floor) */}
      {Array.from({ length: floors }).map((_, floorIdx) => {
        if (floorIdx % 3 === 2 && floorIdx > 0) {
          return (
            <group key={`balcony-${floorIdx}`}>
              {/* Front balcony */}
              <mesh 
                position={[0, floorIdx * floorHeight + floorHeight/2, -buildingDepth/2 - 0.8]}
                castShadow
                receiveShadow
              >
                <boxGeometry args={[buildingWidth * 0.8, 0.15, 1.5]} />
                <meshStandardMaterial 
                  color="#475569" 
                  metalness={0.4} 
                  roughness={0.6}
                />
              </mesh>
              
              {/* Balcony railing */}
              <mesh 
                position={[0, floorIdx * floorHeight + floorHeight/2 + 0.5, -buildingDepth/2 - 1.5]}
              >
                <boxGeometry args={[buildingWidth * 0.8, 1, 0.05]} />
                <meshStandardMaterial 
                  color="#94a3b8" 
                  metalness={0.7} 
                  roughness={0.3}
                  transparent
                  opacity={0.8}
                />
              </mesh>
            </group>
          )
        }
        return null
      })}

      {/* Horizontal bands/accents every 4 floors */}
      {Array.from({ length: floors }).map((_, floorIdx) => {
        if (floorIdx % 4 === 0 && floorIdx > 0) {
          return (
            <group key={`accent-${floorIdx}`}>
              {/* Front accent band */}
              <mesh position={[0, floorIdx * floorHeight, -buildingDepth/2 - 0.05]}>
                <planeGeometry args={[buildingWidth + 2, 0.5]} />
                <meshStandardMaterial 
                  color="#10b981" 
                  emissive="#10b981"
                  emissiveIntensity={0.4}
                  metalness={0.6}
                  roughness={0.4}
                />
              </mesh>
              
              {/* Back accent band */}
              <mesh position={[0, floorIdx * floorHeight, buildingDepth/2 + 0.05]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[buildingWidth + 2, 0.5]} />
                <meshStandardMaterial 
                  color="#10b981" 
                  emissive="#10b981"
                  emissiveIntensity={0.4}
                  metalness={0.6}
                  roughness={0.4}
                />
              </mesh>
            </group>
          )
        }
        return null
      })}

      {/* Corner vertical accent strips */}
      {[
        [-buildingWidth/2 - 0.1, 0, -buildingDepth/2],
        [buildingWidth/2 + 0.1, 0, -buildingDepth/2],
        [-buildingWidth/2 - 0.1, 0, buildingDepth/2],
        [buildingWidth/2 + 0.1, 0, buildingDepth/2],
      ].map((pos, i) => (
        <mesh 
          key={`corner-accent-${i}`}
          position={[pos[0], (floors * floorHeight) / 2, pos[2]]}
          castShadow
        >
          <boxGeometry args={[0.4, floors * floorHeight, 0.4]} />
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#2563eb"
            emissiveIntensity={0.3}
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
      ))}

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

      {/* Penthouse - Modern glass structure on top */}
      <group position={[0, floors * floorHeight + 2, 0]}>
        {/* Penthouse base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[buildingWidth * 0.6, 3, buildingDepth * 0.6]} />
          <meshStandardMaterial 
            color="#2d3748" 
            metalness={0.4} 
            roughness={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {/* Penthouse glass panels */}
        <mesh position={[0, 0, buildingDepth * 0.3 + 0.1]}>
          <planeGeometry args={[buildingWidth * 0.6, 3]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            metalness={0.9} 
            roughness={0.1}
            transparent
            opacity={0.4}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        <mesh position={[0, 0, -buildingDepth * 0.3 - 0.1]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[buildingWidth * 0.6, 3]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            metalness={0.9} 
            roughness={0.1}
            transparent
            opacity={0.4}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Penthouse roof */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <boxGeometry args={[buildingWidth * 0.65, 0.3, buildingDepth * 0.65]} />
          <meshStandardMaterial 
            color="#1e293b" 
            metalness={0.6} 
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Rooftop HVAC Units and Vents */}
      {[
        [buildingWidth * 0.25, floors * floorHeight + 1, buildingDepth * 0.25],
        [-buildingWidth * 0.25, floors * floorHeight + 1, buildingDepth * 0.25],
        [buildingWidth * 0.25, floors * floorHeight + 1, -buildingDepth * 0.25],
        [-buildingWidth * 0.25, floors * floorHeight + 1, -buildingDepth * 0.25],
      ].map((pos, i) => (
        <mesh key={`hvac-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[3, 1.5, 2.5]} />
          <meshStandardMaterial 
            color="#475569" 
            metalness={0.5} 
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Rooftop Vents - Industrial style */}
      {[
        [buildingWidth * 0.15, floors * floorHeight + 1.2, 0],
        [-buildingWidth * 0.15, floors * floorHeight + 1.2, 0],
      ].map((pos, i) => (
        <group key={`vent-${i}`} position={pos as [number, number, number]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.6, 0.8, 2, 8]} />
            <meshStandardMaterial 
              color="#64748b" 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
          {/* Vent grill */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.1, 8]} />
            <meshStandardMaterial 
              color="#334155" 
              metalness={0.8} 
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Communication Tower/Antenna */}
      <group position={[0, floors * floorHeight + 5, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.3, 6, 8]} />
          <meshStandardMaterial 
            color="#94a3b8" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        {/* Red beacon light */}
        <mesh position={[0, 3.5, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial 
            color="#dc2626" 
            emissive="#dc2626"
            emissiveIntensity={1.5}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        {/* Antenna dishes */}
        {[-1.5, 1.5].map((yPos, i) => (
          <mesh key={`dish-${i}`} position={[1, yPos, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.6, 0.4, 0.1, 16]} />
            <meshStandardMaterial 
              color="#e2e8f0" 
              metalness={0.9} 
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Helipad markings (optional) */}
      <group position={[buildingWidth * 0.35, floors * floorHeight + 0.5, -buildingDepth * 0.35]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4, 32]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#f59e0b"
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* "H" marking */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 3]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#fbbf24"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Building Name/Logo on top facade */}
      <mesh position={[0, floors * floorHeight - 2, -buildingDepth/2 - 0.1]} castShadow>
        <planeGeometry args={[12, 2]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981"
          emissiveIntensity={0.8}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Entrance canopy */}
      <mesh position={[0, 2.5, -buildingDepth/2 - 1.5]} castShadow receiveShadow>
        <boxGeometry args={[14, 0.2, 3]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Entrance canopy support beams */}
      {[-5, 5].map((xPos, idx) => (
        <mesh 
          key={`beam-${idx}`} 
          position={[xPos, 1.5, -buildingDepth/2 - 1.5]}
          castShadow
        >
          <boxGeometry args={[0.3, 2, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Main entrance glass doors */}
      <mesh position={[0, 1.5, -buildingDepth/2 - 0.1]} castShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          metalness={0.95} 
          roughness={0.05}
          transparent
          opacity={0.5}
          emissive="#3b82f6"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Entrance steps */}
      {[0, 1, 2].map((step, idx) => (
        <mesh 
          key={`step-${idx}`} 
          position={[0, 0.15 * (step + 1), -buildingDepth/2 - 2.5 - step * 0.3]}
          receiveShadow
        >
          <boxGeometry args={[8, 0.3, 0.4]} />
          <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}

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

export default function Building3D({
  venues,
  activities,
  currentFloor,
  onVenueClick,
  externalSelectedVenue,
}: Building3DProps) {
  const [hoveredVenue, setHoveredVenue] = useState<string | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [programFlowVenue, setProgramFlowVenue] = useState<Venue | null>(null)
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([30, 25, 30])
  const [isZoomed, setIsZoomed] = useState(false)
  const [animating, setAnimating] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Optimized animation stop function
  const stopAnimation = useRef((delay: number = 800) => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = setTimeout(() => {
      setAnimating(false)
    }, delay)
  })

  // Update selected venue when external selection changes (from sidebar)
  useEffect(() => {
    if (externalSelectedVenue) {
      const venue = venues.find(v => v.id === externalSelectedVenue)
      if (venue) {
        // Zoom to the venue
        const zoomDistance = 15
        setCameraTarget([
          venue.position.x + zoomDistance,
          venue.position.y + 10,
          venue.position.z + zoomDistance
        ])
        setIsZoomed(true)
        setAnimating(true)
        setSelectedVenue(externalSelectedVenue)
        
        // Stop animating after camera reaches target
        stopAnimation.current(800)
      }
    }
  }, [externalSelectedVenue, venues])

  // Reset zoom when floor changes
  useEffect(() => {
    if (isZoomed) {
      setCameraTarget([30, 25, 30])
      setIsZoomed(false)
      setAnimating(true)
      stopAnimation.current(800)
    }
  }, [currentFloor])

  const handleVenueClick = useRef((venue: Venue) => {
    // Start zoom animation
    setAnimating(true)
    
    // Zoom into the venue
    const zoomDistance = 15
    setCameraTarget([
      venue.position.x + zoomDistance,
      venue.position.y + 10,
      venue.position.z + zoomDistance
    ])
    setIsZoomed(true)
    
    // Show program flow for main auditorium, mph1, and workshop venues
    const workshopVenues = ['library-workshop', 'physics-workshop', 'cafeteria-holding']
    const showProgramFlow = venue.id === 'main-auditorium' || 
                           venue.id === 'mph1' || 
                           workshopVenues.includes(venue.id)
    
    // Stop animation after zoom completes, then show modal/details
    stopAnimation.current(800)
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = setTimeout(() => {
      setAnimating(false)
      
      if (showProgramFlow) {
        setProgramFlowVenue(venue)
        setSelectedVenue(null)
      } else {
        setSelectedVenue(venue.id)
        onVenueClick(venue)
        setProgramFlowVenue(null)
      }
    }, 800)
  }).current

  // Handle zoom reset
  const handleZoomReset = useRef(() => {
    setAnimating(true)
    setCameraTarget([30, 25, 30])
    setIsZoomed(false)
    setSelectedVenue(null)
    
    stopAnimation.current(800)
  }).current

  // Get hovered venue data for tooltip - Memoized
  const hoveredVenueData = useMemo(() => 
    hoveredVenue ? venues.find(v => v.id === hoveredVenue) : null,
    [hoveredVenue, venues]
  )
  
  const hoveredVenueActivities = useMemo(() => 
    hoveredVenueData ? activities.filter(a => a.venue === hoveredVenueData.id) : [],
    [hoveredVenueData, activities]
  )

  return (
    <>
      <Canvas
        camera={{ 
          position: [30, 25, 30], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        shadows="soft"
        dpr={[1, 2]}
      >
        {/* Camera animation */}
        <CameraController target={cameraTarget} enabled={animating} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enabled={!animating}
          minDistance={30}
          maxDistance={180}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.1}
        />
        
        {/* Lighting - Simplified for mobile */}
        <ambientLight intensity={0.5} />
        
        {/* Main sun light */}
        <directionalLight
          position={[40, 60, 40]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-left={-90}
          shadow-camera-right={90}
          shadow-camera-top={90}
          shadow-camera-bottom={-90}
          shadow-camera-near={0.5}
          shadow-camera-far={250}
          shadow-bias={-0.0001}
        />
        
        {/* Fill lights - Reduced on mobile */}
        <directionalLight position={[-40, 40, -40]} intensity={0.6} />
        <directionalLight position={[0, 30, -50]} intensity={0.4} />
      
        {/* Hemisphere light for natural sky/ground lighting */}
        <hemisphereLight 
          intensity={0.4} 
          color="#87CEEB" 
          groundColor="#2c3e50" 
        />
        
        {/* Spot light for dramatic effect - Desktop only */}
        <spotLight
          position={[0, 70, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={0.5}
          castShadow
        />
        
        {/* Environment map for realistic reflections */}
        <Environment preset="city" background={false} blur={0.8}>
          {/* Custom light formers for accent lighting */}
          <Lightformer
            position={[10, 10, 10]}
            intensity={0.5}
            width={10}
            height={10}
            color="#60a5fa"
          />
          <Lightformer
            position={[-10, 10, -10]}
            intensity={0.3}
            width={10}
            height={10}
            color="#a78bfa"
          />
        </Environment>
        
        {/* Building Structure */}
        <BuildingStructure 
          floors={12} 
          currentFloor={currentFloor}
          hasSelection={false}
        />
        
        {/* Venue boxes */}
        {venues.map((venue) => (
          <VenueBoxComponent
            key={venue.id}
            venue={venue}
            isSelected={selectedVenue === venue.id}
            isOnCurrentFloor={venue.floor === currentFloor}
            onClick={() => handleVenueClick(venue)}
            onHover={(hovered: boolean) => {
              setHoveredVenue(hovered ? venue.id : null)
            }}
            isHovered={hoveredVenue === venue.id}
            isMobile={false}
          />
        ))}
      </Canvas>

      {/* Zoom Reset Button */}
      {isZoomed && (
        <button
          onClick={handleZoomReset}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-xl transition-all flex items-center gap-2 font-semibold hover:scale-105 active:scale-95 border border-blue-400/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
          Reset View
        </button>
      )}

      {/* Hover Tooltip */}
      {hoveredVenueData && !programFlowVenue && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 max-w-md w-full px-4">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-xl border-2 border-blue-500/50 rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse flex-shrink-0" 
                    style={{ backgroundColor: hoveredVenueData.color }}
                  />
                  <span>{hoveredVenueData.name}</span>
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                  Floor {hoveredVenueData.floor + 1}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-600/20 rounded-lg p-3 border border-blue-500/30">
                <div className="text-blue-300 text-xs mb-1">Capacity</div>
                <div className="text-white font-bold text-xl">{hoveredVenueData.capacity}</div>
              </div>
              <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-500/30">
                <div className="text-purple-300 text-xs mb-1">Activities</div>
                <div className="text-white font-bold text-xl">{hoveredVenueActivities.length}</div>
              </div>
            </div>

            {hoveredVenueActivities.length > 0 && (
              <div className="bg-green-600/20 rounded-lg p-3 border border-green-500/30 mb-3">
                <div className="text-green-300 text-xs font-semibold mb-2">Next Activity:</div>
                <div className="text-white text-sm font-semibold">{hoveredVenueActivities[0].title}</div>
                <div className="text-slate-300 text-xs mt-1">{hoveredVenueActivities[0].speaker}</div>
              </div>
            )}

            <div className="text-center pt-3 border-t border-slate-700">
              <p className="text-slate-400 text-xs">
                👆 Click to view full schedule
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Program Flow Modal */}
      <ProgramFlowModal
        isOpen={programFlowVenue !== null}
        onClose={() => setProgramFlowVenue(null)}
        venueName={programFlowVenue?.name || ''}
        venueId={programFlowVenue?.id || ''}
        activities={activities}
      />
    </>
  )
}
