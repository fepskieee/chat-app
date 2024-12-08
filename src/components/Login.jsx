import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth"

import { firebaseAuth, firebaseGoogleProvider } from "@/firebase/firebaseConfig"

function Login({ setToken }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/chat"

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        navigate(from, { replace: true })
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [navigate, from])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      )

      navigate(from, { replace: true })
    } catch (error) {
      alert(error.message)
    }
  }

  const handleGoogleSignIn = async () => {
    firebaseGoogleProvider.addScope(
      "https://www.googleapis.com/auth/gmail.readonly"
    )

    try {
      await signInWithPopup(firebaseAuth, firebaseGoogleProvider)

      navigate(from, { replace: true })
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form className="flex flex-col items-center" onSubmit={handleLogin}>
        <input
          className="mb-2 p-2 border border-gray-300 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="mb-2 p-2 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
          type="submit"
        >
          Login
        </button>
      </form>
      <button
        className="bg-red-500 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>
      <p className="mt-4">
        Don&#39;t have an account?
        <button className="text-blue-500" onClick={() => navigate("/register")}>
          Register
        </button>
      </p>
    </div>
  )
}

export default Login
