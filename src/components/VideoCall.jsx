import React, { useEffect, useState } from "react"
import axios from "axios"
import Video from "twilio-video"

const VideoCall = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [room, setRoom] = useState(null)
  const [token, setToken] = useState(null)
  const [localParticipant, setLocalParticipant] = useState(null)
  const [videoTrack, setVideoTrack] = useState(null)
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

    Video.connect(token, {
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
              const videoElement = document.getElementById("remote-video")
              track.attach(videoElement)
            }
          })
        })

        const localParticipant = room.localParticipant
        setLocalParticipant(localParticipant)

        const localVideoTrack = localParticipant.videoTracks[0]?.track
        if (localVideoTrack) {
          const videoElement = document.getElementById("local-video")
          localVideoTrack.attach(videoElement)
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
    setVideoTrack(null)
    setRemoteParticipants([])
  }

  const handleStartLocalVideo = async () => {
    try {
      const localMedia = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      const videoElement = document.getElementById("local-video")
      videoElement.srcObject = localMedia
      setVideoTrack(localMedia.getVideoTracks()[0])
    } catch (error) {
      console.error("Error starting local video:", error)
    }
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

      {!isConnected && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-8"
          onClick={handleStartLocalVideo}
        >
          Start Local Video
        </button>
      )}

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

          {remoteParticipants.length > 0 &&
            remoteParticipants.map((participant, index) => (
              <div
                key={index}
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
      )}
    </div>
  )
}

export default VideoCall
