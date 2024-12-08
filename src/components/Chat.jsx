import { useState, useEffect } from "react"
import { firebaseAuth, firebaseDB } from "@/firebase/firebaseConfig"
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore"
import { supabase } from "@/supabase/supabaseConfig"
import { v4 as uuidv4 } from "uuid"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [attachment, setAttachment] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const q = query(collection(firebaseDB, "messages"), orderBy("createdAt"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    setAttachment(file)
  }

  const uploadFile = async (file) => {
    if (!file) return null

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("chat-app")
        .upload(filePath, file)

      if (error) {
        console.error("Upload error", error)
        return null
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("chat-app")
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (err) {
      console.error("File upload error", err)
      return null
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()

    if (newMessage.trim() === "") return

    const attachmentUrl = attachment ? await uploadFile(attachment) : null

    const userDoc = await getDoc(
      doc(firebaseDB, "users", firebaseAuth.currentUser.uid)
    )
    const username = userDoc.exists() ? userDoc.data().username : "Unknown User"

    const messageData = {
      text: newMessage,
      createdAt: new Date(),
      user: username,
      attachment: attachment
        ? { url: attachmentUrl, filename: attachment.name }
        : null,
    }

    await addDoc(collection(firebaseDB, "messages"), messageData)

    setNewMessage("")
    setAttachment(null)
    document.getElementById("fileInput").value = ""
  }

  const renderAttachment = (attachment) => {
    const { url, filename } = attachment
    if (!url) return null

    const iconMap = {
      txt: "📄",
      pdf: "📄",
      doc: "📃",
      docx: "📃",
      xls: "📊",
      xlsx: "📊",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
    }

    const fileExtension = url.split(".").pop().toLowerCase()
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "ico"]

    if (imageExtensions.includes(fileExtension)) {
      return (
        <img
          src={url}
          alt={filename}
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      )
    }

    return (
      <div>
        {iconMap[fileExtension] || "📁"}
        <a href={url} target="_blank" rel="noopener noreferrer" download>
          {filename}
        </a>
      </div>
    )
  }
  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth)
      navigate("/login")
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  const getTimeDifference = (timestamp) => {
    const now = new Date()
    const seconds = Math.floor((now - timestamp.toDate()) / 1000)

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
    } else {
      const hours = Math.floor(seconds / 3600)
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`
    }
  }

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{msg.user}: </strong>
            {msg.text}
            {msg.attachment && renderAttachment(msg.attachment)}
            <p>{getTimeDifference(msg.createdAt)}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <input
          id="fileInput"
          type="file"
          onChange={handleFileSelect}
          // Optional: Limit file types
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.ico"
        />
        <button type="submit">Send</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Chat
