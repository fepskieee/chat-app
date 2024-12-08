import { useState, useEffect } from "react"
import { firebaseAuth } from "@/firebase/firebaseConfig"
import axios from "axios"

function EmailRetriever() {
  const [emails, setEmails] = useState([])

  useEffect(() => {
    const fetchEmails = async () => {
      const user = firebaseAuth.currentUser

      if (user) {
        const accessToken = await user.getIdToken(true)

        try {
          const response = await axios.get(
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

          // Fetch full email details
          const emailPromises = response.data.messages.map(async (message) => {
            const emailResponse = await axios.get(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
            return emailResponse.data
          })

          const fullEmails = await Promise.all(emailPromises)
          setEmails(fullEmails)
        } catch (error) {
          console.error(
            "Error retrieving emails:",
            error.response ? error.response.data : error.message
          )
        }
      } else {
        console.log("User is not logged in")
      }
    }

    fetchEmails()
  }, [])

  return (
    <div>
      <button onClick={() => fetchEmails()}>Retrieve Emails</button>
      {emails.map((email, index) => {
        function decodeBase64(str) {
          return atob(str.replace(/-/g, "+").replace(/_/g, "/"))
        }

        const rawContent = email.payload.body.data
        console.log(rawContent)
        // const decodedContent = decodeBase64(rawContent)

        return (
          <div key={index}>
            {/* Parse and display email details here */}
            {/* You'll need to decode base64 email content */}
          </div>
        )
      })}
    </div>
  )
}

export default EmailRetriever
