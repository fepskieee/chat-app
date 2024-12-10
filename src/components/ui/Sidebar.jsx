import { Link } from "react-router-dom"

const Sidebar = () => (
  <div className="bg-gray-50 fixed h-screen flex flex-col">
    <div className="flex flex-1 overflow-hidden">
      <nav className="w-64 p-4 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
        <ul className="space-y-1">
          <li>
            <Link
              to="chat"
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i className="fas fa-comments w-5"></i>
              <span className="ml-3">Chats</span>
            </Link>
          </li>
          <li>
            <Link
              to="sms"
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i className="fas fa-sms w-5"></i>
              <span className="ml-3">SMS</span>
            </Link>
          </li>
          <li>
            <Link
              to="phone"
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i className="fas fa-phone w-5"></i>
              <span className="ml-3">Phone</span>
            </Link>
          </li>
          <li>
            <Link
              to="/email"
              className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-envelope w-5"></i>
              <span className="ml-3">Email</span>
              {/* <span className="ml-auto bg-custom text-white text-xs py-0.5 px-2 rounded-full">
                24
              </span> */}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
)

export default Sidebar
