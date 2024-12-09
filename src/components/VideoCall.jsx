import React, { useEffect, useState } from "react"
import axios from "axios"
import Video from "twilio-video"

const VideoCall = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [room, setRoom] = useState(null)
  const [token, setToken] = useState(null)
  const [localParticipant, setLocalParticipant] = useState(null)
  const [videoTrack, setVideoTrack] = useState(null)

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get("http://localhost:80/token")
        setToken(response.data.token)
      } catch (error) {
        console.error("Error fetching token", error)
      }
    }

    getToken()
  }, [])

  const connectToRoom = () => {
    Video.connect(token, {
      name: "DailyStandupRoom", // Video room name
      audio: true,
      video: { width: 640 },
    }).then((room) => {
      setRoom(room)
      setIsConnected(true)

      room.on("participantConnected", (participant) => {
        console.log(`${participant.identity} connected`)

        participant.on("trackSubscribed", (track) => {
          if (track.kind === "video") {
            const videoElement = document.getElementById("remote-video")
            track.attach(videoElement)
          }
        })
      })

      setLocalParticipant(room.localParticipant)
      setVideoTrack(localParticipant.videoTracks[0]?.track)

      if (videoTrack) {
        const videoElement = document.getElementById("local-video")
        videoTrack.attach(videoElement)
      }
    })
  }

  const handleDisconnect = () => {
    if (room) {
      room.disconnect()
    }
    setIsConnected(false)
    setRoom(null)
    setLocalParticipant(null)
    setVideoTrack(null)
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Twilio Video Call</h1>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={connectToRoom}
          disabled={isConnected}
        >
          {isConnected ? "Connected" : "Start Video Call"}
        </button>
        {isConnected && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDisconnect}
          >
            Disconnect
          </button>
        )}
      </div>

      {isConnected && (
        <div className="flex space-x-4 mt-8">
          <div className="w-64 h-64 bg-gray-300 flex items-center justify-center">
            <video
              id="local-video"
              autoPlay
              muted
              className="w-full h-full"
            ></video>
          </div>
          <div className="w-64 h-64 bg-gray-300 flex items-center justify-center">
            <video id="remote-video" autoPlay className="w-full h-full"></video>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCall
