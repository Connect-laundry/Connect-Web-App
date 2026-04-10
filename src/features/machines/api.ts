import { apiGet, apiPost, apiPatch, apiDelete } from "@/shared/api/client";
import { Machine, MachineStatus } from "@/shared/types";

/**
 * Get all machines registered for the laundry
 */
export const getMachines = async () => {
  return apiGet<Machine[]>("/laundries/dashboard/machines/");
};

/**
 * Get a single machine by its ID
 * @param machineId - The UUID of the machine
 */
export const getMachine = async (machineId: string) => {
  return apiGet<Machine>(`/laundries/dashboard/machines/${machineId}/`);
};

/**
 * Register a new machine for the laundry
 * @param machine - The machine details (name, type, and optional notes)
 */
export const createMachine = async (machine: {
  name: string;
  machine_type: string;
  notes?: string;
}) => {
  return apiPost<Machine>("/laundries/dashboard/machines/", machine);
};

/**
 * Update a machine's details (name, type, or notes)
 * @param machineId - The UUID of the machine to update
 * @param machine - The fields to update (all optional)
 */
export const updateMachine = async (
  machineId: string,
  machine: Partial<Pick<Machine, "name" | "machine_type" | "notes">>,
) => {
  return apiPatch<Machine>(
    `/laundries/dashboard/machines/${machineId}/`,
    machine,
  );
};

/**
 * Toggle a machine's operational status
 * @param machineId - The UUID of the machine
 * @param status - New status: IDLE, BUSY, MAINTENANCE, or OUT_OF_ORDER
 */
export const updateMachineStatus = async (
  machineId: string,
  status: MachineStatus,
) => {
  return apiPatch<Machine>(
    `/laundries/dashboard/machines/${machineId}/status/`,
    { status },
  );
};

/**
 * Permanently delete a machine from the inventory
 * @param machineId - The UUID of the machine to delete
 */
export const deleteMachine = async (machineId: string) => {
  return apiDelete<void>(`/laundries/dashboard/machines/${machineId}/`);
};
