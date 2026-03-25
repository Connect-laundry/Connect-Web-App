import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { Sidebar } from '@/shared/components/layout/Sidebar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-[#F8FAFC] dark:bg-background overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
