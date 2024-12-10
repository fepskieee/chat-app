import { useState } from "react"
import Inbox from "./Inbox"

const SendMessage = () => {
  const [to, setTo] = useState("")
  const [body, setBody] = useState("")
  const [countryCode, setCountryCode] = useState("+1")

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:80/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, body }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)
      alert(
        result.success
          ? "SMS sent successfully!"
          : "Failed to send SMS: " + result.error
      )
    } catch (error) {
      console.error("Error sending SMS:", error)
      alert("An error occurred: " + error.message)
    }
  }

  return (
    <div className="flex space-x-10">
      <div className="bg-white shadow-md fixed left-72 top-64 transform -translate-y-1/2 rounded-lg p-6 max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Send SMS
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="border border-gray-300 rounded-md p-2 pr-6 focus:ring focus:ring-blue-500"
            >
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+91">+91 (India)</option>
              <option value="+63">+63 (PH)</option>
            </select>
            <input
              type="text"
              id="to"
              name="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              placeholder="Recipient Number"
              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700"
            >
              Message:
            </label>
            <textarea
              id="body"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500 resize-none overflow-auto transition duration-200 ease-in-out"
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200 ease-in-out"
          >
            Send SMS
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md translate-x-96 rounded-lg p-4 max-w-screen-md max-h-[500px] overflow-y-auto">
        <Inbox />
      </div>
    </div>
  )
}

export default SendMessage
