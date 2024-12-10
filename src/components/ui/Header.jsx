import { firebaseAuth } from "@/firebase/firebaseConfig"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Header = () => {
  const navigate = useNavigate()
  const [isLogged, setIsLogged] = useState(null)
  // const from = location.state?.from?.pathname || "/login"

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
  //     if (user) {
  //       setIsLogged(user)
  //       navigate(from, { replace: true })
  //     } else {
  //       setLoading(false)
  //     }
  //   })

  //   return () => unsubscribe()
  // }, [navigate, from])

  const handleLogout = async () => {
    try {
      setIsLogged(await signOut(firebaseAuth))
      navigate("/login")
    } catch (error) {
      console.error("Logout error", error)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 py-2 px-4 sticky top-0 z-10">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full !rounded-button sidebar-toggle">
            <i className="fas fa-bars text-gray-600"></i>
          </button>
          <img
            src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
            alt="Gmail"
            className="h-8"
          />
        </div>
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-100 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-custom focus:bg-white"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-500"></i>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full !rounded-button">
            <i className="fas fa-cog text-gray-600"></i>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full !rounded-button">
            <i className="fas fa-th text-gray-600"></i>
          </button>
          <button className="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center !rounded-button">
            <span>J</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-14 p-1 h-8 bg-red-600 rounded-full text-white flex items-center justify-center !rounded-button"
          >
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
