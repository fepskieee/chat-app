import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { firebaseAuth, firebaseDB } from "@/firebase/firebaseConfig"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        navigate("/chat", { replace: true })
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  if (loading) {
    return <div>Loading...</div>
  }
  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      )

      await setDoc(doc(firebaseDB, "users", userCredential.user.uid), {
        username,
        email,
      })

      navigate("/chat")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?
        <button onClick={() => navigate("/login")}>Login</button>
      </p>
    </div>
  )
}

export default Register
