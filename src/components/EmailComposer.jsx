import axios from "axios"

function EmailComposer() {
  const [email, setEmail] = useState({
    to: "",
    subject: "",
    body: "",
  })

  const handleSendEmail = async (e) => {
    e.preventDefault()
    try {
      await axios.post("/api/send-email", email)
      alert("Email sent successfully!")
      // Reset form
      setEmail({ to: "", subject: "", body: "" })
    } catch (error) {
      console.error("Email send failed", error)
      alert("Failed to send email")
    }
  }

  return (
    <form onSubmit={handleSendEmail}>
      <input
        type="email"
        placeholder="To"
        value={email.to}
        onChange={(e) => setEmail({ ...email, to: e.target.value })}
        required
      />
      <input
        placeholder="Subject"
        value={email.subject}
        onChange={(e) => setEmail({ ...email, subject: e.target.value })}
        required
      />
      <textarea
        placeholder="Email Body"
        value={email.body}
        onChange={(e) => setEmail({ ...email, body: e.target.value })}
        required
      />
      <button type="submit">Send Email</button>
    </form>
  )
}

export default EmailComposer
