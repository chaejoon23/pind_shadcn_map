"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download } from "lucide-react"
import Image from "next/image"
import type { VideoData } from "@/components/main-dashboard"

interface HistorySidebarProps {
  videos: VideoData[]
  selectedVideos: string[]
  onVideoToggle: (videoId: string) => void
  onVideoClick: (video: VideoData) => void
}

export function HistorySidebar({ videos, selectedVideos, onVideoToggle, onVideoClick }: HistorySidebarProps) {
  if (videos.length === 0) {
    return (
      <div className="h-full bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Pind</h1>
          <p className="text-sm text-gray-600 mt-1">History</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Download className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            PIND 익스텐션을 사용해
            <br />첫 장소들을 찾아보세요!
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Download Extension
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Pind</h1>
        <p className="text-sm text-gray-600 mt-1">History</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex p-3 rounded-lg hover:bg-gray-50 transition-colors items-center space-x-3"
            >
              <Checkbox
                checked={selectedVideos.includes(video.id)}
                onCheckedChange={() => onVideoToggle(video.id)}
                className="mt-1"
              />
              <div className="flex-shrink-0 cursor-pointer" onClick={() => onVideoClick(video)}>
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  width={80}
                  height={60}
                  className="rounded object-cover hover:opacity-80 transition-opacity"
                />
              </div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onVideoClick(video)}>
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-500">{video.date}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {video.locations.length} location{video.locations.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
