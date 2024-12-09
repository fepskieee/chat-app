import axios from "axios"
import { useState, useRef } from "react"

function EmailComposer() {
  const fileInputRef = useRef(null)
  const [email, setEmail] = useState({
    to: "",
    subject: "",
    body: "",
    attachments: [],
  })

  // const handleFileChange = (e) => {
  //   setEmail((prev) => ({ ...prev, attachments: e.target.files[0] }))
  // }

  const handleSendEmail = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("to", email.to)
    formData.append("subject", email.subject)
    formData.append("body", email.body)

    if (email.attachments && email.attachments.length > 0) {
      email.attachments.forEach((file) => {
        formData.append("attachments[]", file) // Attach each file under the key "attachments[]"
      })
    }

    try {
      await axios.post("http://localhost:80/send-email", formData)

      setEmail({ ...email, to: "", subject: "", body: "", attachments: [] })
      fileInputRef.current.value = null
      alert("Email sent successfully!")
    } catch (error) {
      console.error("Email send failed", error)
      alert("Failed to send email")
    }
  }

  return (
    <form
      onSubmit={handleSendEmail}
      className="space-y-4 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Compose Email</h2>
      <input
        type="email"
        placeholder="To"
        value={email.to}
        onChange={(e) => setEmail({ ...email, to: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        placeholder="Subject"
        value={email.subject}
        onChange={(e) => setEmail({ ...email, subject: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Email Body"
        value={email.body}
        onChange={(e) => setEmail({ ...email, body: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="6"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) =>
          setEmail({ ...email, attachments: Array.from(e.target.files) })
        }
        multiple
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Send Email
      </button>
    </form>
  )
}

export default EmailComposer
