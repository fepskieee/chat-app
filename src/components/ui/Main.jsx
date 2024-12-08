import React from "react"

const Main = () => {
  return (
    <div class="bg-gray-50 h-screen flex flex-col font-[&#39;Inter&#39;]">
      <header class="bg-white border-b border-gray-200 py-2 px-4">
        <div class="max-w-8xl mx-auto flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-gray-100 rounded-full !rounded-button sidebar-toggle">
              <i class="fas fa-bars text-gray-600"></i>
            </button>
            <img
              src="https://ai-public.creatie.ai/gen_page/logo_placeholder.png"
              alt="Gmail"
              class="h-8"
            />
          </div>
          <div class="flex-1 max-w-2xl mx-4">
            <div class="relative">
              <input
                type="text"
                placeholder="Search mail"
                class="w-full bg-gray-100 border-0 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-custom focus:bg-white"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-500"></i>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-gray-100 rounded-full !rounded-button">
              <i class="fas fa-cog text-gray-600"></i>
            </button>
            <button class="p-2 hover:bg-gray-100 rounded-full !rounded-button">
              <i class="fas fa-th text-gray-600"></i>
            </button>
            <button class="w-8 h-8 rounded-full bg-custom text-white flex items-center justify-center !rounded-button">
              <span>J</span>
            </button>
          </div>
        </div>
      </header>
      <div class="flex flex-1 overflow-hidden">
        <nav
          class="w-64 p-4 bg-white border-r border-gray-200 flex flex-col email-sidebar hidden"
          id="email-sidebar"
        >
          <button class="bg-custom hover:bg-custom/90 text-white px-6 py-3 rounded-lg shadow-sm mb-6 flex items-center !rounded-button block">
            <i class="fas fa-plus mr-2"></i>New Message
          </button>
          <div class="space-y-1">
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-inbox w-5"></i>
              <span class="ml-3">Inbox</span>
            </a>
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-star w-5"></i>
              <span class="ml-3">Starred</span>
            </a>
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-paper-plane w-5"></i>
              <span class="ml-3">Sent</span>
            </a>
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-file w-5"></i>
              <span class="ml-3">Drafts</span>
            </a>
          </div>
        </nav>
        <nav class="w-64 p-4 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
          <button class="bg-custom hover:bg-custom/90 text-white px-6 py-3 rounded-lg shadow-sm mb-6 flex items-center !rounded-button hidden">
            <i class="fas fa-plus mr-2"></i>New Message
          </button>
          <div class="space-y-1">
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 rounded-lg bg-gray-100"
            >
              <i class="fas fa-envelope w-5"></i>
              <span class="ml-3">Email</span>
              <span class="ml-auto bg-custom text-white text-xs py-0.5 px-2 rounded-full">
                24
              </span>
            </a>
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-comments w-5"></i>
              <span class="ml-3">Chats</span>
            </a>
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-sms w-5"></i>
              <span class="ml-3">SMS</span>
            </a>
            <a
              href="#"
              class="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i class="fas fa-phone w-5"></i>
              <span class="ml-3">Phone</span>
            </a>
          </div>
        </nav>
        <main class="flex-1 overflow-auto bg-white">
          <div class="border-b border-gray-200 py-2 px-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-custom focus:ring-custom"
              />
              <button class="p-2 hover:bg-gray-100 rounded !rounded-button">
                <i class="fas fa-redo text-gray-600"></i>
              </button>
              <button class="p-2 hover:bg-gray-100 rounded !rounded-button">
                <i class="fas fa-ellipsis-v text-gray-600"></i>
              </button>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div class="px-4 py-3 hover:bg-gray-50 flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="mr-4 rounded border-gray-300 text-custom focus:ring-custom"
              />
              <i class="fas fa-star text-gray-400 mr-4"></i>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-gray-900 truncate">GitHub</p>
                  <p class="text-sm text-gray-500">10:30 AM</p>
                </div>
                <div class="flex items-center text-gray-500">
                  <p class="font-medium truncate">
                    New pull request notification
                  </p>
                  <p class="mx-2">-</p>
                  <p class="truncate">
                    Your repository has received a new pull request #123 from
                    user@github.com
                  </p>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 hover:bg-gray-50 flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="mr-4 rounded border-gray-300 text-custom focus:ring-custom"
              />
              <i class="fas fa-star text-yellow-400 mr-4"></i>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-gray-900 truncate">Slack</p>
                  <p class="text-sm text-gray-500">9:15 AM</p>
                </div>
                <div class="flex items-center text-gray-500">
                  <p class="font-medium truncate">Team meeting reminder</p>
                  <p class="mx-2">-</p>
                  <p class="truncate">
                    Daily standup meeting in 15 minutes. Join via the link
                    provided.
                  </p>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 hover:bg-gray-50 flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="mr-4 rounded border-gray-300 text-custom focus:ring-custom"
              />
              <i class="fas fa-star text-gray-400 mr-4"></i>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between">
                  <p class="font-semibold text-gray-900 truncate">Dropbox</p>
                  <p class="text-sm text-gray-500">Yesterday</p>
                </div>
                <div class="flex items-center text-gray-500">
                  <p class="font-medium truncate">Storage limit reaching</p>
                  <p class="mx-2">-</p>
                  <p class="truncate">
                    Your Dropbox storage is almost full. Consider upgrading your
                    plan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Main