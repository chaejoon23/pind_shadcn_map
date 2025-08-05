"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, MapPin, Tag } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef } from "react"
import type { LocationData } from "@/components/main-dashboard"

interface PlaceDetailsPanelProps {
  location: LocationData
  onClose: () => void
  position?: { x: number; y: number }
}

export function PlaceDetailsPanel({ location, onClose, position }: PlaceDetailsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (position) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, position])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // If no position provided, render as full sidebar (mobile)
  if (!position) {
    return (
      <div className="h-full bg-white border-r border-gray-200 flex flex-col animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Place Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <PlaceDetailsContent location={location} onClose={onClose} />
        </div>
      </div>
    )
  }

  // Calculate position to prevent popup from going off screen
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 320), // 320px is popup width
    y: Math.max(20, Math.min(position.y, window.innerHeight - 400)), // 400px is approximate popup height
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 pointer-events-auto" onClick={onClose} />

      {/* Popup */}
      <Card
        ref={panelRef}
        className="fixed w-80 max-h-96 shadow-2xl border-0 bg-white pointer-events-auto animate-in zoom-in-95 duration-200"
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
      >
        <CardContent className="p-0 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Place Details</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-80 overflow-auto">
            <PlaceDetailsContent location={location} onClose={onClose} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Extracted content component for reuse
function PlaceDetailsContent({ location, onClose }: { location: LocationData; onClose: () => void }) {
  return (
    <>
      {/* Place Image */}
      <div className="relative h-32">
        <Image src={location.image || "/placeholder.svg"} alt={location.name} fill className="object-cover" />
      </div>

      {/* Place Info */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{location.name}</h3>

          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Tag className="w-4 h-4" />
            <span>{location.category}</span>
          </div>

          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{location.address}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{location.description}</p>
        </div>

        <div className="pt-2">
          <Button className="w-full" size="sm">
            View on Map
          </Button>
        </div>
      </div>
    </>
  )
}
