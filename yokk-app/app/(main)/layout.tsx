'use client'

import React, { useState } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <Header onMenuClick={toggleSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Page Content */}
        <main className="
          flex-1 overflow-y-auto
          bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]
        ">
          {/* Content Container with max-width and padding */}
          <div className="
            max-w-7xl mx-auto
            px-4 sm:px-6 lg:px-8
            py-6 sm:py-8 lg:py-12
          ">
            {/* Subtle ambient glow effects */}
            <div className="relative">
              {/* Top-left ambient glow */}
              <div className="
                absolute -top-40 -left-40
                w-96 h-96 rounded-full
                bg-violet-500/5 blur-3xl
                pointer-events-none
              " />

              {/* Bottom-right ambient glow */}
              <div className="
                absolute -bottom-40 -right-40
                w-96 h-96 rounded-full
                bg-emerald-500/5 blur-3xl
                pointer-events-none
              " />

              {/* Content */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
