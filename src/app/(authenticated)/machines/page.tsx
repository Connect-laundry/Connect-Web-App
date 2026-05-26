"use client";

import { useState, useEffect } from "react";
import { Machine, MachineStatus } from "@/shared/types";
import { getMachines, updateMachineStatus, deleteMachine } from "@/features/machines/api";
import { MachineCard } from "@/features/machines/components/MachineCard";
import { Button } from "@/shared/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMachines();
      
      // Handle differently structured backend responses
      const machinesList = Array.isArray(response) 
        ? response 
        : (response as any).data || (response as any).results || [];
        
      setMachines(machinesList);
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load machines. Please try again.");
      } else {
        setError("Failed to load machines. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);


  const handleStatusChange = async (id: string, newStatus: MachineStatus) => {
    try {
      setActionLoadingId(id);
      setError(null);
      const updatedMachine = await updateMachineStatus(id, newStatus);
      
      // Update the machine in our local state
      setMachines((prev) => 
        prev.map((m) => (m.id === id ? { ...m, ...updatedMachine } : m))
      );
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update machine status.");
      } else {
        setError("Failed to update machine status.");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this machine?")) return;
    
    try {
      setActionLoadingId(id);
      setError(null);
      await deleteMachine(id);
      
      // Remove it from the local state
      setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to delete machine.");
      } else {
        setError("Failed to delete machine.");
      }
      setActionLoadingId(null); // only clear here if error, otherwise it's unmounted
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Machine Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Track and manage your shop floor equipment in real-time.
          </p>
        </div>
        
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Machine
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : machines.length === 0 ? (
        /* Empty State */
        <div className="text-center p-12 border border-dashed rounded-xl bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No machines found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            You haven&apos;t added any washing machines or dryers yet. Click the button above to get started.
          </p>
          <Button variant="outline" className="bg-white">
            <Plus className="w-4 h-4 mr-2" /> Add Your First Machine
          </Button>
        </div>
      ) : (
        /* Machines Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {machines.map((machine) => (
            <MachineCard
              key={machine.id}
              machine={machine}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              isLoading={actionLoadingId === machine.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
