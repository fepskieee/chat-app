import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Login from "@/components/Login"
import Register from "@/components/Register"
import Chat from "@/components/Chat"
import PrivateRoute from "@/components/PrivateRoute"
import Inbox from "@/components/Inbox"
import SendMessage from "@/components/SendMessage"
import EmailComposer from "@/components/EmailComposer"
import EmailLists from "./components/EmailLists"
import Main from "./components/ui/Main"
import DialPad from "./components/DialPad"
import VideoCall from "./components/VideoCall"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/dial" element={<DialPad />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/video" element={<VideoCall />} />
        <Route
          path="/inbox"
          element={
            <PrivateRoute>
              <Inbox />
            </PrivateRoute>
          }
        />
        <Route
          path="/send-sms"
          element={
            <PrivateRoute>
              <SendMessage />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-email"
          element={
            <PrivateRoute>
              <EmailComposer />
            </PrivateRoute>
          }
        />
        <Route
          path="/email"
          element={
            <PrivateRoute>
              <EmailLists />
            </PrivateRoute>
          }
        />
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
