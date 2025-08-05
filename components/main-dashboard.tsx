"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapView } from "@/components/map-view"
import { MobileOverlay } from "@/components/mobile-overlay"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { CheckedVideosPanel } from "@/components/checked-videos-panel"
import { HistorySidebar } from "@/components/history-sidebar"

export interface VideoData {
  id: string
  title: string
  thumbnail: string
  date: string
  locations: LocationData[]
}

export interface LocationData {
  id: string
  name: string
  address: string
  category: string
  description: string
  image: string
  coordinates: { lat: number; lng: number }
  videoId: string
}

// Mock data
const mockVideos: VideoData[] = [
  {
    id: "1",
    title: "Amazing Seoul Food Tour - Best Korean Street Food",
    thumbnail: "/placeholder.svg?height=80&width=120",
    date: "2024-01-15",
    locations: [
      {
        id: "loc1",
        name: "Myeongdong Kyoja",
        address: "29 Myeongdong 10-gil, Jung-gu, Seoul",
        category: "Restaurant",
        description: "Famous for handmade noodles and dumplings since 1966",
        image: "/placeholder.svg?height=200&width=300",
        coordinates: { lat: 37.5665, lng: 126.978 },
        videoId: "1",
      },
      {
        id: "loc2",
        name: "Gwangjang Market",
        address: "88 Changgyeonggung-ro, Jongno-gu, Seoul",
        category: "Market",
        description: "Traditional market famous for bindaetteok and mayak gimbap",
        image: "/placeholder.svg?height=200&width=300",
        coordinates: { lat: 37.5707, lng: 126.9996 },
        videoId: "1",
      },
    ],
  },
  {
    id: "2",
    title: "Hidden Gems in Busan - Local's Guide",
    thumbnail: "/placeholder.svg?height=80&width=120",
    date: "2024-01-10",
    locations: [
      {
        id: "loc3",
        name: "Gamcheon Culture Village",
        address: "203 Gamnae 2-ro, Saha-gu, Busan",
        category: "Tourist Attraction",
        description: "Colorful hillside village known as the Machu Picchu of Busan",
        image: "/placeholder.svg?height=200&width=300",
        coordinates: { lat: 35.0975, lng: 129.0107 },
        videoId: "2",
      },
    ],
  },
]

export function MainDashboard() {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [showMobileOverlay, setShowMobileOverlay] = useState(false)
  const [mobileView, setMobileView] = useState<"list" | "details">("list")
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)
  const [showCheckedVideos, setShowCheckedVideos] = useState(false)
  const [clickedVideo, setClickedVideo] = useState<VideoData | null>(null)

  // Auto-select the first video when component mounts
  useEffect(() => {
    if (mockVideos.length > 0 && selectedVideos.length === 0) {
      setSelectedVideos([mockVideos[0].id])
    }
  }, [selectedVideos.length])

  const selectedLocations = mockVideos
    .filter((video) => selectedVideos.includes(video.id))
    .flatMap((video) => video.locations)

  const handleVideoToggle = (videoId: string) => {
    setSelectedVideos((prev) => (prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]))
  }

  const handleLocationSelect = (location: LocationData, event?: React.MouseEvent) => {
    setSelectedLocation(location)
    setMobileView("details")

    // Capture click position for desktop popup
    if (event && window.innerWidth >= 768) {
      const rect = event.currentTarget.getBoundingClientRect()
      setPopupPosition({
        x: rect.right + 10, // Position to the right of the clicked item
        y: rect.top,
      })
    }
  }

  const handleMapPinClick = (location: LocationData) => {
    setSelectedLocation(location)
    setMobileView("details")
  }

  const handleVideoClick = (video: VideoData) => {
    setClickedVideo(video)
    setShowCheckedVideos(true)
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex w-full">
        {/* Left Sidebar - History Only */}
        <div className="w-80 flex-shrink-0">
          <HistorySidebar
            videos={mockVideos}
            selectedVideos={selectedVideos}
            onVideoToggle={handleVideoToggle}
            onVideoClick={handleVideoClick}
          />
        </div>

        {/* Checked Videos Panel */}
        {showCheckedVideos && (
          <div className="w-80 flex-shrink-0">
            <CheckedVideosPanel
              videos={mockVideos}
              selectedVideos={selectedVideos}
              clickedVideo={clickedVideo}
              onClose={() => setShowCheckedVideos(false)}
            />
          </div>
        )}

        {/* Map View */}
        <div className="flex-1">
          <MapView
            locations={selectedLocations}
            selectedLocation={selectedLocation}
            onPinClick={handleMapPinClick}
            onPinHover={setSelectedLocation}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full relative">
        {/* Map View (Full Screen) */}
        <MapView locations={selectedLocations} selectedLocation={selectedLocation} onPinClick={handleMapPinClick} />

        {/* Mobile Menu Button */}
        <Button
          onClick={() => setShowMobileOverlay(true)}
          className="absolute top-4 left-4 z-10 w-12 h-12 rounded-full shadow-lg"
          size="icon"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Mobile Overlay */}
        <MobileOverlay
          isOpen={showMobileOverlay}
          view={mobileView}
          videos={mockVideos}
          selectedVideos={selectedVideos}
          selectedLocation={selectedLocation}
          onClose={() => setShowMobileOverlay(false)}
          onVideoToggle={handleVideoToggle}
          onVideoClick={handleVideoClick}
          onBackToList={() => setMobileView("list")}
        />
      </div>
    </div>
  )
}
