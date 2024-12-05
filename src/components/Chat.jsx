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
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom"

function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
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

  const sendMessage = async (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const userDoc = await getDoc(
      doc(firebaseDB, "users", firebaseAuth.currentUser.uid)
    )
    const username = userDoc.exists() ? userDoc.data().username : "Unknown User"

    await addDoc(collection(firebaseDB, "messages"), {
      text: newMessage,
      createdAt: new Date(),
      user: username,
    })

    setNewMessage("")
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
        <button type="submit">Send</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Chat
