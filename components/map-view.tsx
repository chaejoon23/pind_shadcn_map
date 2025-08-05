"use client"

import { useRef, useState } from "react"
import type { LocationData } from "@/components/main-dashboard"
import { MapPin, Tag } from "@/components/icons"

interface MapViewProps {
  locations: LocationData[]
  selectedLocation: LocationData | null
  onPinClick: (location: LocationData) => void
  onPinHover?: (location: LocationData | null) => void
}

export function MapView({ locations, selectedLocation, onPinClick, onPinHover }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoveredLocation, setHoveredLocation] = useState<LocationData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null)

  return (
    <div className="h-full relative bg-gray-100">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {/* Placeholder Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
          {/* Grid Pattern */}
          <div
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Map Pins */}
        {locations.map((location, index) => (
          <button
            key={location.id}
            onClick={() => onPinClick(location)}
            onMouseEnter={(e) => {
              setHoveredLocation(location)
              const rect = e.currentTarget.getBoundingClientRect()
              setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.top - 10,
              })
              onPinHover?.(location)
            }}
            onMouseLeave={() => {
              setHoveredLocation(null)
              setTooltipPosition(null)
              onPinHover?.(null)
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 hover:scale-110 ${
              selectedLocation?.id === location.id ? "scale-125 z-10" : "z-0"
            }`}
            style={{
              left: `${30 + ((index * 15) % 60)}%`,
              top: `${40 + ((index * 10) % 40)}%`,
            }}
          >
            <div
              className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                selectedLocation?.id === location.id ? "bg-blue-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>

            {/* Pin Label */}
            <div
              className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-white rounded shadow-md text-xs font-medium whitespace-nowrap transition-opacity ${
                selectedLocation?.id === location.id ? "opacity-100" : "opacity-0 hover:opacity-100"
              }`}
            >
              {location.name}
            </div>
          </button>
        ))}

        {/* Hover Tooltip */}
        {hoveredLocation && tooltipPosition && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{hoveredLocation.name}</h4>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                    <Tag className="w-3 h-3" />
                    <span>{hoveredLocation.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{hoveredLocation.address}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="flex text-yellow-400">
                      {"★".repeat(4)}
                      {"☆".repeat(1)}
                    </div>
                    <span className="text-xs text-gray-500">4.2</span>
                  </div>
                </div>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
              </div>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="w-10 h-10 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 text-lg font-bold">
            +
          </button>
          <button className="w-10 h-10 bg-white rounded shadow-md flex items-center justify-center hover:bg-gray-50 text-lg font-bold">
            −
          </button>
        </div>

        {/* Map Attribution */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          Map Data © Pind
        </div>
      </div>

      {/* Empty State */}
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">Select videos to see locations on the map</p>
          </div>
        </div>
      )}
    </div>
  )
}
