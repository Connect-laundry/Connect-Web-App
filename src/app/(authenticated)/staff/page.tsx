'use client'

import { Alert, AlertDescription } from '@/shared/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useStaffManagement } from '@/features/staff/hooks/useStaffManagement'
import { StaffHeader } from '@/features/staff/components/StaffHeader'
import { StaffStatsCard } from '@/features/staff/components/StaffStatsCard'
import { StaffGuidanceBanner } from '@/features/staff/components/StaffGuidanceBanner'
import { StaffTable } from '@/features/staff/components/StaffTable'
import { StaffModal } from '@/features/staff/components/StaffModal'

export default function StaffPage() {
  const {
    filteredAssignments,
    orders,
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
    handleCreateAssignment,
    handleDeleteAssignment,
    uniqueDrivers,
    activeAssignments,
    completedAssignments,
  } = useStaffManagement()

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <StaffHeader
        loading={loading}
        onRefresh={fetchData}
        onOpenModal={() => setIsModalOpen(true)}
      />

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {/* Guidance Banner */}
      <StaffGuidanceBanner onAssignClick={() => setIsModalOpen(true)} />

      {/* Stat Cards */}
      <StaffStatsCard
        driverCount={uniqueDrivers.size}
        activeCount={activeAssignments.length}
        completedCount={completedAssignments.length}
      />

      {/* Assignments Table */}
      <StaffTable
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        assignments={filteredAssignments}
        onDeleteAssignment={handleDeleteAssignment}
      />

      {/* Assignment Dialog Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        orders={orders}
        uniqueDrivers={uniqueDrivers}
        selectedOrderId={selectedOrderId}
        setSelectedOrderId={setSelectedOrderId}
        driverId={driverId}
        setDriverId={setDriverId}
        assignmentType={assignmentType}
        setAssignmentType={setAssignmentType}
        isSubmitting={isSubmitting}
        modalError={modalError}
        onSubmit={handleCreateAssignment}
      />
    </div>
  )
}
