/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"
import { firebaseAuth } from "@/firebase/firebaseConfig"

function PrivateRoute({ children }) {
  const user = firebaseAuth.currentUser

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
