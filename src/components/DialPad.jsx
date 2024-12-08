import React, { useState, useEffect } from "react"
import { Device } from "@twilio/voice-sdk"

function DialPad() {
  const [recipient, setRecipient] = useState("")
  const [callStatus, setCallStatus] = useState("idle")
  const [twilioDevice, setTwilioDevice] = useState(null)
  const [currentCall, setCurrentCall] = useState(null)

  useEffect(() => {
    const initTwilioDevice = async () => {
      try {
        const response = await fetch("http://localhost:80/token")
        const { token } = await response.json()

        if (!token) {
          throw new Error("No token received")
        }

        const device = new Device(token, {
          codecPreferences: ["opus", "pcmu"],
          sounds: true,
          debug: true,
        })

        device.on("ready", () => {
          console.log("Twilio Device is ready")
        })

        // device.on("ringing", (call) => {
        // setCallStatus("incoming")
        // setCurrentCall(call)
        // })

        device.on("incoming", (call) => {
          console.log("Incoming call details:", {
            from: call.parameters.From,
            to: call.parameters.To,
            callSid: call.parameters.CallSid,
          })

          setCallStatus("incoming")
          setCurrentCall(call)
        })

        device.on("connected", (call) => {
          console.log("Call connected:", {
            from: call.parameters.From,
            to: call.parameters.To,
            callSid: call.parameters.CallSid,
          })

          setCallStatus("connected")
          setCurrentCall(call)
        })

        device.on("disconnected", () => {
          setCallStatus("idle")
          setCurrentCall(null)
        })

        device.on("rejected", () => {
          setCallStatus("idle")
          setCurrentCall(null)
        })

        device.on("error", () => {
          setCallStatus("rejected")
          setCurrentCall(null)
        })

        device.register()
        setTwilioDevice(device)
      } catch (error) {
        console.error("Device initialization error:", error)
      }
    }

    initTwilioDevice()

    return () => {
      if (twilioDevice) {
        twilioDevice.destroy()
      }
    }
  }, [])

  const handleNumberClick = (value) => {
    setRecipient((prev) => prev + value)
  }

  const handleDelete = () => {
    setRecipient((prev) => prev.slice(0, -1))
  }

  const handleCall = async () => {
    if (!recipient) return

    try {
      const response = await fetch("http://localhost:80/outgoing-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipient,
          url: "https://stinkbug-worthy-cheaply.ngrok-free.app/twiml",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to initiate call")
      }
    } catch (error) {
      console.error("Call initiation error:", error)
    }
  }

  const handleAcceptCall = (currentCall) => {
    currentCall.accept()
    setCallStatus("connected")
    setCurrentCall(currentCall)
  }

  const handleRejectedCall = (currentCall) => {
    currentCall.reject()
    setCallStatus("idle")
    setCurrentCall(null)
  }

  const handleEndCall = (currentCall) => {
    if (currentCall) {
      currentCall.disconnect()
      setCallStatus("idle")
    }
  }

  const renderCallButtons = () => {
    switch (callStatus) {
      case "idle":
        return (
          <button
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
            onClick={handleCall}
          >
            <i className="fas fa-phone text-lg"></i>
          </button>
        )
      case "incoming":
        return (
          <>
            <button
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
              onClick={() => handleAcceptCall(currentCall)}
            >
              <i className="fas fa-phone text-lg"></i>
            </button>
            <button
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              onClick={() => handleRejectedCall(currentCall)}
            >
              <i className="fas fa-phone-slash text-lg"></i>
            </button>
          </>
        )
      case "connected":
        return (
          <button
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            onClick={() => handleEndCall(currentCall)}
          >
            <i className="fas fa-phone-slash text-lg"></i>
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="w-[360px] h-[640px] bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col">
        <div className="h-1/4 bg-gray-50 flex items-center justify-between p-6">
          <input
            type="text"
            value={recipient}
            readOnly
            className="w-4/5 text-center text-3xl font-mono bg-transparent border-none focus:ring-0 focus:outline-none"
            placeholder="Enter number"
          />
          <button
            className="w-12 h-12 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
            id="delete-btn"
            onClick={handleDelete}
          >
            <i className="fas fa-backspace text-2xl"></i>
          </button>
        </div>

        {/* Dial Pad */}
        <div className="h-2/3 grid grid-cols-3 gap-4 p-6">
          {[
            { value: "1", label: "" },
            { value: "2", label: "ABC" },
            { value: "3", label: "DEF" },
            { value: "4", label: "GHI" },
            { value: "5", label: "JKL" },
            { value: "6", label: "MNO" },
            { value: "7", label: "PQRS" },
            { value: "8", label: "TUV" },
            { value: "9", label: "WXYZ" },
            { value: "*", label: "" },
            { value: "0", label: "+" },
            { value: "#", label: "" },
          ].map((item, index) => (
            <button
              key={index}
              className="dialpad-btn flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition"
              onClick={() => handleNumberClick(item.value)}
            >
              <span className="text-2xl">{item.value}</span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="h-1/6 flex items-center justify-center mt-8 space-x-8">
          {renderCallButtons()}
          {callStatus === "connected" && (
            <p className="text-green-600">Call in progress</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DialPad
