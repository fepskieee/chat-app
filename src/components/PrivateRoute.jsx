/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom"
import { firebaseAuth } from "@/firebase/firebaseConfig"

function PrivateRoute({ children }) {
  const user = firebaseAuth.currentUser
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default PrivateRoute
