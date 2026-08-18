'use client'

import { Suspense, useState } from 'react'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Spinner } from '@/shared/ui/spinner'
import { AlertCircle } from 'lucide-react'
import { useStaffManagement } from '@/features/staff/hooks/useStaffManagement'
import { StaffHeader } from '@/features/staff/components/StaffHeader'
import { StaffStatsCard } from '@/features/staff/components/StaffStatsCard'
import { StaffGuidanceBanner } from '@/features/staff/components/StaffGuidanceBanner'
import { StaffTable } from '@/features/staff/components/StaffTable'
import { StaffModal } from '@/features/staff/components/StaffModal'
import { CreateDriverModal } from '@/features/staff/components/CreateDriverModal'

const StaffPageContent = () => {
  const [isCreateDriverOpen, setIsCreateDriverOpen] = useState(false)
  const {
    filteredAssignments,
    orders,
    drivers,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchData,
    isModalOpen,
    setIsModalOpen,
    selectedOrderId,
    setSelectedOrderId,
    driverId,
    setDriverId,
    assignmentType,
    setAssignmentType,
    isSubmitting,
    modalError,
    isOrderLocked,
    handleCreateAssignment,
    handleDeleteAssignment,
    uniqueDrivers,
    activeAssignments,
    completedAssignments,
  } = useStaffManagement()

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <StaffHeader
        loading={loading}
        onRefresh={fetchData}
        onOpenAssignModal={() => setIsModalOpen(true)}
        onOpenCreateDriverModal={() => setIsCreateDriverOpen(true)}
      />

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      <StaffGuidanceBanner />

      <StaffStatsCard
        driverCount={uniqueDrivers.size}
        activeCount={activeAssignments.length}
        completedCount={completedAssignments.length}
      />

      <StaffTable
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        assignments={filteredAssignments}
        onDeleteAssignment={handleDeleteAssignment}
      />

      <StaffModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        orders={orders}
        drivers={drivers}
        selectedOrderId={selectedOrderId}
        setSelectedOrderId={setSelectedOrderId}
        driverId={driverId}
        setDriverId={setDriverId}
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        isSubmitting={isSubmitting}
        modalError={modalError}
        isOrderLocked={isOrderLocked}
        onSubmit={handleCreateAssignment}
      />

      <CreateDriverModal
        isOpen={isCreateDriverOpen}
        onOpenChange={setIsCreateDriverOpen}
        onCreated={fetchData}
      />
    </div>
  )
}

const StaffPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      }
    >
      <StaffPageContent />
    </Suspense>
  )
}

export default StaffPage
