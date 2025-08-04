"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, MapPin, Tag, ExternalLink, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import type { VideoData } from "@/components/main-dashboard"
import { createGoogleMapsKML, type GoogleMapsLocation } from "@/lib/google-maps-api"
import { useGoogleAuth } from "@/components/google-auth-provider"

interface CheckedVideosPanelProps {
  videos: VideoData[]
  selectedVideos: string[]
  clickedVideo: VideoData | null
  onClose: () => void
}

export function CheckedVideosPanel({ videos, selectedVideos, clickedVideo, onClose }: CheckedVideosPanelProps) {
  const { isSignedIn, signIn } = useGoogleAuth()
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [creationStatus, setCreationStatus] = useState<{
    type: "success" | "error" | null
    message: string
    link?: string
  }>({ type: null, message: "" })

  // Get all selected videos
  const checkedVideos = videos.filter((video) => selectedVideos.includes(video.id))

  // Get all locations from checked videos
  const allLocations = checkedVideos.flatMap((video) => video.locations)

  // Convert to Google Maps format
  const googleMapsLocations: GoogleMapsLocation[] = allLocations.map((location) => ({
    name: location.name,
    address: location.address,
    category: location.category,
    description: location.description,
    coordinates: location.coordinates,
  }))

  const handleMoveToGoogleMaps = async () => {
    if (!isSignedIn) {
      try {
        await signIn()
      } catch (error) {
        setCreationStatus({
          type: "error",
          message: "Please sign in to Google to create maps lists",
        })
        return
      }
    }

    setIsCreatingList(true)
    setCreationStatus({ type: null, message: "" })

    try {
      // Generate incremental number for the list name
      const timestamp = Date.now()
      const listNumber = Math.floor(timestamp / 1000) % 10000 // Use timestamp for uniqueness
      const listName = `Pind${listNumber}`

      // Create KML file in Google Drive (more reliable than My Maps API)
      const result = await createGoogleMapsKML(listName, googleMapsLocations)

      setCreationStatus({
        type: "success",
        message: `Successfully created "${listName}" with ${googleMapsLocations.length} locations!`,
        link: result.webViewLink,
      })

      // Auto-open the created map
      window.open(result.webViewLink, "_blank")
    } catch (error) {
      console.error("Error creating Google Maps list:", error)
      setCreationStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to create Google Maps list",
      })
    } finally {
      setIsCreatingList(false)
    }
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Checked Videos</h2>
          <p className="text-sm text-gray-500">
            {checkedVideos.length} video{checkedVideos.length !== 1 ? "s" : ""} • {allLocations.length} location
            {allLocations.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Status Alert */}
            {creationStatus.type && (
              <Alert
                className={
                  creationStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                }
              >
                {creationStatus.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={creationStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                  {creationStatus.message}
                  {creationStatus.link && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(creationStatus.link, "_blank")}
                        className="text-green-700 border-green-300 hover:bg-green-100"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open in Google Maps
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Google Sign-in Notice */}
            {!isSignedIn && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Sign in to Google to create and save maps lists to your account.
                </AlertDescription>
              </Alert>
            )}

            {checkedVideos.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm">No videos selected</p>
                <p className="text-gray-400 text-xs mt-1">Check videos from History to see their locations</p>
              </div>
            ) : (
              checkedVideos.map((video, videoIndex) => (
                <div key={video.id}>
                  {/* Video divider with title */}
                  {videoIndex > 0 && (
                    <div className="relative my-6">
                      <Separator />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white px-3 text-xs font-medium text-gray-500 max-w-[250px] truncate">
                          {video.title}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* First video title (no separator above) */}
                  {videoIndex === 0 && checkedVideos.length > 1 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-gray-500 truncate">{video.title}</h3>
                    </div>
                  )}

                  {/* Locations for this video */}
                  <div className="space-y-3">
                    {video.locations.map((location) => (
                      <div
                        key={location.id}
                        className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">{location.name}</h4>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                              <Tag className="w-3 h-3" />
                              <span>{location.category}</span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{location.address}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Move to Google Maps Button */}
        {allLocations.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleMoveToGoogleMaps}
              disabled={isCreatingList}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreatingList ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Google Maps List...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Move to Google Maps
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {isSignedIn
                ? `Will create a new list with ${allLocations.length} locations`
                : "Sign in to Google to save locations"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
