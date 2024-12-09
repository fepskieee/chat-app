import React, { useState, useEffect } from "react"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import axios from "axios"
import DOMPurify from "dompurify"

function EmailRetriever() {
  const [emails, setEmails] = useState([])
  const [error, setError] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)

  const fetchEmails = async () => {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      try {
        const result = await signInWithPopup(auth, new GoogleAuthProvider())

        const credential = GoogleAuthProvider.credentialFromResult(result)

        if (credential) {
          const accessToken = credential.accessToken
          localStorage.setItem("googleapi_accessToken", accessToken)
        }
      } catch (authError) {
        setError("Authentication failed")
        console.error(authError)
        return
      }
    }

    const accessToken = localStorage.getItem("googleapi_accessToken")

    if (!accessToken) {
      setError("No access token available")
      return
    }

    try {
      const messagesResponse = await axios.get(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          params: {
            maxResults: 10,
          },
        }
      )

      const emailDetailsPromises = messagesResponse.data.messages.map(
        async (message) => {
          try {
            const detailResponse = await axios.get(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            return detailResponse.data
          } catch (detailError) {
            console.error(`Error fetching message ${message.id}:`, detailError)
            return null
          }
        }
      )

      const emailDetails = await Promise.all(emailDetailsPromises)
      const validEmails = emailDetails.filter((email) => email !== null)

      setEmails(validEmails)
    } catch (fetchError) {
      setError("Failed to retrieve emails")
      console.error(
        "Email fetch error:",
        fetchError.response ? fetchError.response.data : fetchError
      )
    }
  }

  const decodeBase64 = (str) => {
    try {
      return atob(
        str
          .replace(/-/g, "+")
          .replace(/_/g, "/")
          .padEnd(str.length + ((4 - (str.length % 4)) % 4), "=")
      )
    } catch (error) {
      console.error("Base64 decoding error:", error)
      return ""
    }
  }

  const parseEmailDetails = (email) => {
    if (!email.payload) return "No payload"

    const headers = email.payload.headers || []
    const subjectHeader = headers.find((h) => h.name === "Subject")
    const fromHeader = headers.find((h) => h.name === "From")
    const dateHeader = headers.find((h) => h.name === "Date")

    let body = ""
    const extractBodyFromParts = (parts) => {
      for (let part of parts) {
        if (part.mimeType === "text/html" && part.body && part.body.data) {
          return decodeBase64(part.body.data)
        }
        if (part.mimeType === "text/plain" && part.body && part.body.data) {
          return decodeBase64(part.body.data)
        }
        if (part.parts) {
          const nestedBody = extractBodyFromParts(part.parts)
          if (nestedBody) return nestedBody
        }
      }
      return ""
    }

    if (email.payload.body && email.payload.body.data) {
      body = decodeBase64(email.payload.body.data)
    } else if (email.payload.parts) {
      body = extractBodyFromParts(email.payload.parts)
    }

    return {
      id: email.id,
      subject: subjectHeader ? subjectHeader.value : "No Subject",
      from: fromHeader ? fromHeader.value : "Unknown Sender",
      date: dateHeader ? dateHeader.value : "Unknown Date",
      snippet: email.snippet || "",
      body: body,
    }
  }

  const handleEmailClick = async (emailId) => {
    const accessToken = localStorage.getItem("googleapi_accessToken")

    try {
      const response = await axios.get(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const parsedEmail = parseEmailDetails(response.data)
      setSelectedEmail(parsedEmail)
    } catch (error) {
      console.error("Error fetching email content:", error)
      setError("Failed to fetch email content")
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  const handleBackToList = () => {
    setSelectedEmail(null)
  }

  const renderEmailList = () => (
    <div className="container mx-auto p-4">
      <button
        onClick={fetchEmails}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Refresh Emails
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      {emails.length === 0 && !error ? (
        <p className="text-gray-500">No emails found or loading...</p>
      ) : (
        emails.map((email) => {
          const parsedEmail = parseEmailDetails(email)
          return (
            <div
              key={parsedEmail.id}
              onClick={() => handleEmailClick(parsedEmail.id)}
              className="border border-gray-200 p-3 mb-2 rounded cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-bold text-sm">{parsedEmail.from}</h3>
              <h4 className="text-gray-700 text-xs">{parsedEmail.subject}</h4>
              <p className="text-gray-500 text-xs truncate">
                {parsedEmail.snippet}
              </p>
            </div>
          )
        })
      )}
    </div>
  )

  const renderEmailContent = () => (
    <div className="container mx-auto p-4">
      <button
        onClick={handleBackToList}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
      >
        Back to Emails
      </button>

      {selectedEmail && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">{selectedEmail.subject}</h2>
          <div className="text-gray-600 mb-4">
            <p>From: {selectedEmail.from}</p>
            <p>Date: {selectedEmail.date}</p>
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedEmail.body || ""),
            }}
          />
        </div>
      )}
    </div>
  )

  return <div>{selectedEmail ? renderEmailContent() : renderEmailList()}</div>
}

export default EmailRetriever
