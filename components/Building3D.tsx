'use client'

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, Lightformer, Text } from '@react-three/drei'
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

interface VenueBoxProps {
  venue: Venue
  isSelected: boolean
  isOnCurrentFloor: boolean
  onClick: () => void
  onHover: (hovered: boolean) => void
  isHovered: boolean
  isMobile: boolean
}

// Camera animation component - Optimized with early returns
const CameraController = React.memo(function CameraController({ 
  target, 
  enabled 
}: { 
  target: [number, number, number]
  enabled: boolean 
}) {
  const { camera, controls } = useThree()
  const targetRef = useRef(new THREE.Vector3())
  const lookAtRef = useRef(new THREE.Vector3())
  const lastTargetRef = useRef<[number, number, number]>(target)
  
  useEffect(() => {
    // Only update if target actually changed
    if (lastTargetRef.current[0] !== target[0] || 
        lastTargetRef.current[1] !== target[1] || 
        lastTargetRef.current[2] !== target[2]) {
      targetRef.current.set(...target)
      lookAtRef.current.set(target[0] - 15, target[1] - 10, target[2] - 15)
      lastTargetRef.current = target
    }
  }, [target])
  
  useFrame(() => {
    if (!enabled || !controls) return
    
    const currentDist = camera.position.distanceTo(targetRef.current)
    
    // Stop animating when close enough (optimization)
    if (currentDist < 0.1) return
    
    // Smooth lerp with easing
    camera.position.lerp(targetRef.current, 0.08)
    // @ts-ignore
    controls.target.lerp(lookAtRef.current, 0.08)
    // @ts-ignore
    controls.update()
  })
  
  return null
})

// Individual venue box component - Memoized for performance
const VenueBoxComponent = React.memo(function VenueBoxComponent({
  venue,
  isSelected,
  isOnCurrentFloor,
  onClick,
  onHover,
  isHovered,
  isMobile,
}: VenueBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Memoize computed values
  const baseOpacity = useMemo(() => isOnCurrentFloor ? 0.95 : 0.25, [isOnCurrentFloor])
  const emissiveIntensity = useMemo(() => isHovered ? 3.5 : isSelected ? 4.0 : 0.8, [isHovered, isSelected])
  const scale = useMemo(() => isHovered ? 1.08 : isSelected ? 1.05 : 1, [isHovered, isSelected])
  const displayName = useMemo(() => 
    venue.name.length > 20 ? venue.name.substring(0, 17) + '...' : venue.name,
    [venue.name]
  )
  const fontSize = useMemo(() => Math.min(venue.size.width, venue.size.depth) * 0.15, [venue.size.width, venue.size.depth])

  // Enhanced glow colors
  const glowColor = useMemo(() => {
    if (isSelected) return '#FFD700' // Bright gold
    if (isHovered) return '#00FFFF' // Cyan
    return '#00FF00' // Green
  }, [isSelected, isHovered])

  useFrame((state) => {
    if (!meshRef.current) return
    
    if (isSelected) {
      meshRef.current.position.y = venue.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.3
    } else {
      meshRef.current.position.y = venue.position.y
    }
  })

  const handlePointerEnter = useCallback(() => {
    if (!isMobile) onHover(true)
  }, [isMobile, onHover])

  const handlePointerLeave = useCallback(() => {
    if (!isMobile) onHover(false)
  }, [isMobile, onHover])

  return (
    <group
      position={[venue.position.x, venue.position.y, venue.position.z]}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Main Floor - Solid Colored Rectangle */}
      <mesh ref={meshRef} castShadow receiveShadow scale={scale} position={[0, 0.15, 0]}>
        <boxGeometry args={[venue.size.width, 0.3, venue.size.depth]} />
        <meshStandardMaterial
          color={venue.color}
          transparent
          opacity={baseOpacity}
          emissive={venue.color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Floor Border - Enhanced contrast */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[venue.size.width + 0.3, 0.15, venue.size.depth + 0.3]} />
        <meshStandardMaterial 
          color="#000000" 
          transparent 
          opacity={baseOpacity * 0.9}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Complete Room Walls */}
      {isOnCurrentFloor && (
        <>
          {/* North Wall */}
          <mesh position={[0, venue.size.height / 2, venue.size.depth / 2]} castShadow>
            <boxGeometry args={[venue.size.width, venue.size.height, 0.15]} />
            <meshStandardMaterial
              color={venue.color}
              transparent
              opacity={0.6}
              emissive={venue.color}
              emissiveIntensity={emissiveIntensity * 0.8}
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
          
          {/* South Wall */}
          <mesh position={[0, venue.size.height / 2, -venue.size.depth / 2]} castShadow>
            <boxGeometry args={[venue.size.width, venue.size.height, 0.15]} />
            <meshStandardMaterial
              color={venue.color}
              transparent
              opacity={0.6}
              emissive={venue.color}
              emissiveIntensity={emissiveIntensity * 0.8}
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
          
          {/* East Wall */}
          <mesh position={[venue.size.width / 2, venue.size.height / 2, 0]} castShadow>
            <boxGeometry args={[0.15, venue.size.height, venue.size.depth]} />
            <meshStandardMaterial
              color={venue.color}
              transparent
              opacity={0.6}
              emissive={venue.color}
              emissiveIntensity={emissiveIntensity * 0.8}
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
          
          {/* West Wall */}
          <mesh position={[-venue.size.width / 2, venue.size.height / 2, 0]} castShadow>
            <boxGeometry args={[0.15, venue.size.height, venue.size.depth]} />
            <meshStandardMaterial
              color={venue.color}
              transparent
              opacity={0.6}
              emissive={venue.color}
              emissiveIntensity={emissiveIntensity * 0.8}
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>
        </>
      )}

      {/* Enhanced Glow Effect with Pulsing Animation */}
      {(isHovered || isSelected) && (
        <>
          {/* Primary Glow */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[venue.size.width * 1.2, 0.1, venue.size.depth * 1.2]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.9}
            />
          </mesh>
          
          {/* Secondary Outer Glow */}
          <mesh position={[0, -0.08, 0]}>
            <boxGeometry args={[venue.size.width * 1.3, 0.08, venue.size.depth * 1.3]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.5}
            />
          </mesh>
          
          {/* Vertical Light Beam for selected */}
          {isSelected && (
            <mesh position={[0, venue.size.height / 2 + 2, 0]}>
              <cylinderGeometry args={[venue.size.width * 0.6, venue.size.width * 0.7, 4, 32]} />
              <meshBasicMaterial
                color={glowColor}
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </>
      )}

      {/* Room Label */}
      {isOnCurrentFloor && (
        <Text
          position={[0, 0.35, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={fontSize}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.15}
          outlineColor="#000000"
          maxWidth={venue.size.width * 0.9}
        >
          {displayName}
        </Text>
      )}
    </group>
  )
}, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isOnCurrentFloor === nextProps.isOnCurrentFloor &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.venue.id === nextProps.venue.id
  )
})

// Building Structure - Memoized for performance
const BuildingStructure = React.memo(function BuildingStructure({ 
  floors = 12, 
  currentFloor, 
  hasSelection 
}: { 
  floors?: number
  currentFloor: number
  hasSelection: boolean 
}) {
  const floorHeight = 4
  const buildingWidth = 55
  const buildingDepth = 55
  
  // Memoize floor opacity calculation
  const getFloorOpacity = useCallback((floorIdx: number) => {
    if (currentFloor === floorIdx) {
      return hasSelection ? 0.01 : 0.05
    }
    return 0.08
  }, [currentFloor, hasSelection])
  
  // Memoize window opacity
  const getWindowOpacity = useCallback((floorIdx: number) => {
    return floorIdx === currentFloor ? 0.08 : 0.25
  }, [currentFloor])
  
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

          {/* Highlight plane for current floor - Enhanced */}
          {i === currentFloor && (
            <>
              <mesh position={[0, i * floorHeight + 0.3, 0]} receiveShadow>
                <boxGeometry args={[buildingWidth + 3, 0.15, buildingDepth + 3]} />
                <meshStandardMaterial
                  color="#10b981"
                  metalness={0.8}
                  roughness={0.2}
                  emissive="#10b981"
                  emissiveIntensity={1.2}
                  transparent
                  opacity={0.4}
                />
              </mesh>
              
              {/* Outer glow ring */}
              <mesh position={[0, i * floorHeight + 0.25, 0]} receiveShadow>
                <boxGeometry args={[buildingWidth + 4, 0.1, buildingDepth + 4]} />
                <meshBasicMaterial
                  color="#10b981"
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </>
          )}
          
          {/* Floor edge lines - always visible for structure */}
          <lineSegments position={[0, i * floorHeight, 0]}>
            <edgesGeometry 
              args={[new THREE.BoxGeometry(buildingWidth, 0.25, buildingDepth)]} 
            />
            <lineBasicMaterial color="#64748b" linewidth={2} opacity={0.6} transparent />
          </lineSegments>
          
          {/* Corner markers with enhanced glow */}
          {[
            [-buildingWidth/2, buildingDepth/2],
            [buildingWidth/2, buildingDepth/2],
            [-buildingWidth/2, -buildingDepth/2],
            [buildingWidth/2, -buildingDepth/2],
          ].map(([x, z], idx) => (
            <mesh key={idx} position={[x, i * floorHeight, z]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial 
                color={i === currentFloor ? '#10b981' : '#64748b'} 
                metalness={0.8} 
                emissive={i === currentFloor ? '#10b981' : '#000000'}
                emissiveIntensity={i === currentFloor ? 2.0 : 0}
                transparent 
                opacity={i === currentFloor ? 1.0 : 0.6} 
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
        const isCurrentFloorWindow = floorIdx === currentFloor
        const windowOpacity = getWindowOpacity(floorIdx)
        
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
                  color={isCurrentFloorWindow ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloorWindow ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloorWindow ? 0.3 : 0.15}
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
                  color={isCurrentFloorWindow ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloorWindow ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloorWindow ? 0.3 : 0.15}
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
                  color={isCurrentFloorWindow ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloorWindow ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloorWindow ? 0.3 : 0.15}
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
                  color={isCurrentFloorWindow ? '#60a5fa' : '#3b82f6'}
                  metalness={0.9}
                  roughness={0.1}
                  emissive={isCurrentFloorWindow ? '#2563eb' : '#1e40af'}
                  emissiveIntensity={isCurrentFloorWindow ? 0.3 : 0.15}
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
})

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPanMode, setIsPanMode] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mouseMoveThrottleRef = useRef<NodeJS.Timeout | null>(null)

  // Track mouse position for tooltip with throttling for performance
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse position updates to every 32ms (~30fps for tooltips)
      if (mouseMoveThrottleRef.current) return
      
      mouseMoveThrottleRef.current = setTimeout(() => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        mouseMoveThrottleRef.current = null
      }, 32)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (mouseMoveThrottleRef.current) {
        clearTimeout(mouseMoveThrottleRef.current)
      }
    }
  }, [])

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

  // Toggle pan mode
  const togglePanMode = useCallback(() => {
    setIsPanMode(prev => !prev)
  }, [])

  // Get hovered venue data for tooltip - Memoized
  const hoveredVenueData = useMemo(() => 
    hoveredVenue ? venues.find(v => v.id === hoveredVenue) : null,
    [hoveredVenue, venues]
  )
  
  const hoveredVenueActivities = useMemo(() => 
    hoveredVenueData ? activities.filter(a => a.venue === hoveredVenueData.id) : [],
    [hoveredVenueData, activities]
  )

  // Calculate tooltip position - smart positioning based on mouse location (Memoized)
  const tooltipPosition = useMemo(() => {
    if (!hoveredVenueData) return { left: 0, top: 0 }
    
    const tooltipWidth = 280
    const tooltipHeight = 200
    const padding = 20
    const { x, y } = mousePosition

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    const isRight = x > screenWidth / 2
    const isBottom = y > screenHeight / 2

    let left = isRight ? x - tooltipWidth - padding : x + padding
    let top = isBottom ? y - tooltipHeight - padding : y + padding

    left = Math.max(padding, Math.min(left, screenWidth - tooltipWidth - padding))
    top = Math.max(padding, Math.min(top, screenHeight - tooltipHeight - padding))

    return { left, top }
  }, [hoveredVenueData, mousePosition])

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
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          logarithmicDepthBuffer: true,
          stencil: false,
        }}
        shadows="soft"
        dpr={[1, 2]}
        frameloop="demand"
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        style={{ background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
      >
        {/* Camera animation */}
        <CameraController target={cameraTarget} enabled={animating} />
        
        {/* Background color */}
        <color attach="background" args={['#0f172a']} />
        
        {/* Fog for depth perception */}
        <fog attach="fog" args={['#0f172a', 80, 250]} />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enabled={!animating}
          minDistance={15}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={0.1}
          panSpeed={2.0}
          zoomSpeed={1.5}
          rotateSpeed={1.0}
          mouseButtons={{
            LEFT: isPanMode ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: isPanMode ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN
          }}
          touches={{
            ONE: isPanMode ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />
        
        {/* Lighting - Enhanced for better color visibility */}
        <ambientLight intensity={0.6} />
        
        {/* Main sun light - Brighter */}
        <directionalLight
          position={[40, 60, 40]}
          intensity={2.0}
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
        
        {/* Fill lights - Enhanced */}
        <directionalLight position={[-40, 40, -40]} intensity={0.8} color="#60a5fa" />
        <directionalLight position={[0, 30, -50]} intensity={0.6} color="#a78bfa" />
      
        {/* Hemisphere light for natural sky/ground lighting - Enhanced */}
        <hemisphereLight 
          intensity={0.6} 
          color="#87CEEB" 
          groundColor="#10b981" 
        />
        
        {/* Spot light for dramatic effect - Brighter */}
        <spotLight
          position={[0, 80, 0]}
          angle={0.5}
          penumbra={0.4}
          intensity={1.0}
          color="#ffffff"
          castShadow
        />
        
        {/* Additional colored accent lights */}
        <pointLight position={[30, 20, 30]} intensity={0.8} color="#10b981" distance={60} />
        <pointLight position={[-30, 20, -30]} intensity={0.8} color="#3b82f6" distance={60} />
        
        {/* Environment map for realistic reflections */}
        <Environment preset="city" background={false} blur={0.6}>
          {/* Custom light formers for accent lighting - Enhanced */}
          <Lightformer
            position={[10, 10, 10]}
            intensity={1.0}
            width={15}
            height={15}
            color="#60a5fa"
          />
          <Lightformer
            position={[-10, 10, -10]}
            intensity={0.8}
            width={15}
            height={15}
            color="#a78bfa"
          />
          <Lightformer
            position={[0, 15, 0]}
            intensity={0.6}
            width={20}
            height={20}
            color="#10b981"
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

      {/* Control Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-3">
        {/* Pan Mode Toggle */}
        <button
          onClick={togglePanMode}
          className={`px-5 py-3 ${
            isPanMode 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
              : 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800'
          } text-white rounded-lg shadow-xl transition-all flex items-center gap-2 font-semibold hover:scale-105 active:scale-95 border ${
            isPanMode ? 'border-green-400/40' : 'border-slate-400/40'
          }`}
          title={isPanMode ? 'Pan Mode: ON (Left-click to pan)' : 'Pan Mode: OFF (Left-click to rotate)'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span className="hidden sm:inline">{isPanMode ? 'Pan Mode' : 'Rotate Mode'}</span>
          <span className="sm:hidden">{isPanMode ? 'Pan' : 'Rotate'}</span>
        </button>

        {/* Zoom Reset Button */}
        {isZoomed && (
          <button
            onClick={handleZoomReset}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg shadow-xl transition-all flex items-center gap-2 font-semibold hover:scale-105 active:scale-95 border border-blue-400/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
            <span className="hidden sm:inline">Reset View</span>
            <span className="sm:hidden">Reset</span>
          </button>
        )}
      </div>

      {/* Hover Tooltip */}
      {hoveredVenueData && !programFlowVenue && (
        <div 
          className="fixed z-40 pointer-events-none"
          style={{
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
          }}
        >
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 backdrop-blur-xl border-2 border-blue-500/50 rounded-lg shadow-2xl animate-in fade-in zoom-in duration-200 w-64 sm:w-72">
            <div className="p-3 sm:p-4">
              {/* Header */}
              <div className="flex items-start gap-2 mb-2">
                <div 
                  className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse flex-shrink-0 mt-1" 
                  style={{ backgroundColor: hoveredVenueData.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight break-words">
                    {hoveredVenueData.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Floor {hoveredVenueData.floor + 1}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-blue-600/20 rounded-md p-2 border border-blue-500/30">
                  <div className="text-blue-300 text-[10px] sm:text-xs">Capacity</div>
                  <div className="text-white font-bold text-base sm:text-lg">{hoveredVenueData.capacity}</div>
                </div>
                <div className="bg-purple-600/20 rounded-md p-2 border border-purple-500/30">
                  <div className="text-purple-300 text-[10px] sm:text-xs">Activities</div>
                  <div className="text-white font-bold text-base sm:text-lg">{hoveredVenueActivities.length}</div>
                </div>
              </div>

              {/* Next Activity */}
              {hoveredVenueActivities.length > 0 && (
                <div className="bg-green-600/20 rounded-md p-2 border border-green-500/30 mb-2">
                  <div className="text-green-300 text-[10px] sm:text-xs font-semibold mb-1">Next Activity:</div>
                  <div className="text-white text-xs sm:text-sm font-semibold line-clamp-1">{hoveredVenueActivities[0].title}</div>
                  <div className="text-slate-300 text-[10px] sm:text-xs mt-0.5 line-clamp-1">{hoveredVenueActivities[0].speaker}</div>
                </div>
              )}

              {/* Action Hint */}
              <div className="text-center pt-2 border-t border-slate-700">
                <p className="text-slate-400 text-[10px] sm:text-xs">
                  👆 Click to view full schedule
                </p>
              </div>
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
