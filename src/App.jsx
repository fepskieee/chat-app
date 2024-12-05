import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Login from "@/components/Login"
import Register from "@/components/Register"
import Chat from "@/components/Chat"
import PrivateRoute from "@/components/PrivateRoute"

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<PrivateRoute element={<Navigate to="/chat" />} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <div>
              <h1>404</h1>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

