'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { Header } from '@/shared/components/layout/Header'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#F8FAFC] dark:bg-background overflow-hidden">
        {/* Responsive Sidebar (Desktop & Mobile Drawer) */}
        <Sidebar
          isCollapsed={!sidebarOpen}
          onToggleCollapse={() => setSidebarOpen((prev) => !prev)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header Bar with Menu Toggles & Profile */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          {/* Scrollable Page Body */}
          <main className="flex-1 overflow-y-auto custom-scrollbar relative">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
