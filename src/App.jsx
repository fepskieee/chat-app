import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import Sidebar from "./components/ui/Sidebar"
import Header from "./components/ui/Header"
import Login from "./components/Login"
import Chat from "./components/Chat"
import SendMessage from "./components/SendMessage"
import EmailLists from "./components/EmailLists"
import DialPad from "./components/DialPad"
import PrivateRoute from "./components/PrivateRoute"
import Register from "./components/Register"

function App() {
  return (
    <Router>
      <Header />
      <div className="flex bg-gray-100 p-4 h-screen">
        <Sidebar />
        <main className="flex-grow ml-72 bg-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" />} />
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
            <Route path="/sms" element={<SendMessage />} />
            <Route path="/phone" element={<DialPad />} />
            <Route path="/email" element={<EmailLists />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
