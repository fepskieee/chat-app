import React, { useState, useEffect } from "react"
import axios from "axios"

const Inbox = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:80/inbox")

        setMessages(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchMessages()

    const intervalId = setInterval(fetchMessages, 3000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return <div>Loading messages...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="messages-container p-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages found.</p>
      ) : (
        <ul className="messages-list  space-y-6">
          {messages
            .filter((message) => message.from === "+17754774049")
            .map((message) => (
              <li
                key={message.sid}
                className="message-item p-4 border rounded shadow ml-32"
              >
                <div className="message-header flex justify-between mb-2">
                  <span className="message-from font-semibold">
                    To: {message.to}
                  </span>
                  <span className="message-date text-gray-600">
                    {new Date(message.dateSent).toLocaleString()}
                  </span>
                </div>
                <div className="message-body text-gray-800">{message.body}</div>
                {/* <div className="message-status text-sm text-gray-500 flex justify-end">
                  {message.status === "delivered" && (
                    <span className="text-green-500">✔️</span> // Green check mark
                  )}
                  {message.status === "failed" && (
                    <span className="text-red-500">❌</span> // Red exclamation mark
                  )}
                  {message.status === "undelivered" && (
                    <span className="text-gray-500">✔️</span> // Gray check mark
                  )}
                  Status: {message.status}
                </div> */}
              </li>
            ))}
          {messages.length > 0 &&
            messages
              .filter((message) => message.to === "+17754774049")
              .map((message) => (
                <li
                  key={message.sid}
                  className="message-item p-4 border rounded shadow mr-32"
                >
                  <div className="message-header flex justify-between mb-2">
                    <span className="message-from font-semibold">
                      From: {message.from}
                    </span>
                    <span className="message-date text-gray-600">
                      {new Date(message.dateSent).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-body text-gray-800">
                    {message.body}
                  </div>
                  {/* <div className="message-status text-sm text-gray-500 flex justify-end">
                    {message.status === "delivered" && (
                      <span className="text-green-500">✔️</span> // Green check mark
                    )}
                    {message.status === "failed" && (
                      <span className="text-red-500">❌</span> // Red exclamation mark
                    )}
                    {message.status === "undelivered" && (
                      <span className="text-gray-500">✔️</span> // Gray check mark
                    )}
                    Status: {message.status}
                  </div> */}
                </li>
              ))}
        </ul>
      )}
    </div>
  )
}

export default Inbox
