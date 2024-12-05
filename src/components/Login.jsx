import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"

import { firebaseAuth } from "@/firebase/firebaseConfig"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password)

      navigate("/chat")
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don&#39;t have an account?
        <button onClick={() => navigate("/register")}>Register</button>
      </p>
    </div>
  )
}

export default Login
