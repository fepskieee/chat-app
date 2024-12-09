import React, { useEffect, useState } from "react"
import axios from "axios"
import { connect } from "twilio-video"

const VideoCall = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [room, setRoom] = useState(null)
  const [token, setToken] = useState(null)
  const [localParticipant, setLocalParticipant] = useState(null)
  const [remoteParticipants, setRemoteParticipants] = useState([])

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
    if (!token) {
      console.log("Token not available yet.")
      return
    }

    connect(token, {
      name: "DailyStandupRoom", // Video room name
      audio: true,
      video: { width: 640 },
    })
      .then((room) => {
        setRoom(room)
        setIsConnected(true)

        room.on("participantConnected", (participant) => {
          console.log(`${participant.identity} connected`)
          setRemoteParticipants((prev) => [...prev, participant])

          participant.on("trackSubscribed", (track) => {
            if (track.kind === "video") {
              // Dynamically create video element for remote participants
              const videoElement = document.createElement("video")
              videoElement.id = `remote-video-${participant.sid}` // Set unique ID
              videoElement.autoplay = true
              videoElement.className = "w-full h-full"
              document.getElementById("remote-videos").appendChild(videoElement) // Add to remote-videos div
              track.attach(videoElement) // Attach track to new element
            }
          })
        })

        const localParticipant = room.localParticipant
        setLocalParticipant(localParticipant)

        const localVideoTrack = localParticipant.videoTracks[0]?.track
        if (localVideoTrack) {
          const videoElement = document.getElementById("local-video")
          localVideoTrack.attach(videoElement) // Attach track directly to the video element
        }
      })
      .catch((error) => {
        console.error("Error connecting to room:", error)
      })
  }

  const handleDisconnect = () => {
    if (room) {
      room.disconnect()
    }
    setIsConnected(false)
    setRoom(null)
    setLocalParticipant(null)
    setRemoteParticipants([])
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Twilio Video Call</h1>
      <div className="flex space-x-4 mb-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={connectToRoom}
          disabled={isConnected || !token}
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
        <div className="flex space-x-4">
          <div className="w-64 h-64 bg-gray-300 flex items-center justify-center">
            <video
              id="local-video"
              autoPlay
              muted
              className="w-full h-full"
            ></video>
          </div>

          <div id="remote-videos" className="flex flex-wrap space-x-4 mt-8">
            {/* Remote participant videos will be appended here dynamically */}
            {remoteParticipants.map((participant) => (
              <div
                key={participant.sid}
                className="w-64 h-64 bg-gray-300 flex items-center justify-center"
              >
                <video
                  id={`remote-video-${participant.sid}`}
                  autoPlay
                  className="w-full h-full"
                ></video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoCall
